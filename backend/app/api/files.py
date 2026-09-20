import secrets
from collections import defaultdict
from fastapi import Request
import os
import uuid
import shutil
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
import bcrypt

from app.database.database import get_db
from app.models.file import FileShare
from app.core.email import send_file_downloaded_email
from fastapi import BackgroundTasks
from app.schemas.file import FileShareResponse, FileVerifyRequest
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

RATE_LIMITS = defaultdict(lambda: {"attempts": 0, "locked_until": None})


UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 1024 * 1024 * 1024  # 1024 MB

import string
import random
def generate_short_code(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

@router.post("/upload", response_model=FileShareResponse)
async def upload_file(
    file: UploadFile = File(...),
    password: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Read file size roughly
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 1024MB.")
        
    # Generate unique filename
    file_uuid = str(uuid.uuid4())
    safe_filename = file.filename.replace(" ", "_")
    stored_filename = f"{file_uuid}_{safe_filename}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)
    
    # Save to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Generate short code
    short_code = generate_short_code()
    while db.query(FileShare).filter(FileShare.short_code == short_code).first():
        short_code = generate_short_code()
        
    # Generate 6-digit PIN unconditionally
    pin = ''.join(secrets.choice(string.digits) for _ in range(6))
    password_hash = pin  # Storing plain-text for persistent sender visibility
    
    # Auto-expire after 5 minutes
    expires_at = datetime.utcnow() + timedelta(minutes=5)
        
    db_file = FileShare(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        content_type=file.content_type,
        size_bytes=file_size,
        short_code=short_code,
        password_hash=password_hash,
        expires_at=expires_at
    )
    
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    # Create response model manually to add has_password
    return {
        "id": db_file.id,
        "user_id": db_file.user_id,
        "filename": db_file.filename,
        "content_type": db_file.content_type,
        "size_bytes": db_file.size_bytes,
        "short_code": db_file.short_code,
        "expires_at": db_file.expires_at,
        "downloads": db_file.downloads,
        "created_at": db_file.created_at,
        "has_password": True,
        "password": pin  # Return plain text only once
    }

@router.get("/me", response_model=List[FileShareResponse])
def get_my_files(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    files = db.query(FileShare).filter(FileShare.user_id == current_user.id).order_by(FileShare.created_at.desc()).all()
    
    response = []
    now = datetime.utcnow()
    for f in files:
        if f.expires_at and now > f.expires_at:
            # Delete expired file
            if os.path.exists(f.file_path):
                os.remove(f.file_path)
            db.delete(f)
            continue
            
        response.append({
            "id": f.id,
            "user_id": f.user_id,
            "filename": f.filename,
            "content_type": f.content_type,
            "size_bytes": f.size_bytes,
            "short_code": f.short_code,
            "expires_at": f.expires_at,
            "downloads": f.downloads,
            "created_at": f.created_at,
            "has_password": f.password_hash is not None,
            "password": f.password_hash  # Returning plain-text PIN for sender dashboard
        })
    db.commit()
    return response

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(file_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_file = db.query(FileShare).filter(FileShare.id == file_id, FileShare.user_id == current_user.id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    # Delete from disk
    if os.path.exists(db_file.file_path):
        os.remove(db_file.file_path)
        
    # Delete from DB
    db.delete(db_file)
    db.commit()
    return None

@router.get("/public/{short_code}")
def get_public_file_info(short_code: str, db: Session = Depends(get_db)):
    """Get metadata about a file before downloading it (to show on the landing page)"""
    db_file = db.query(FileShare).filter(FileShare.short_code == short_code).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    if db_file.expires_at and datetime.utcnow() > db_file.expires_at:
        db.delete(db_file)
        db.commit()
        raise HTTPException(status_code=410, detail="This file link has expired and was deleted")
        
    return {
        "filename": db_file.filename,
        "size_bytes": db_file.size_bytes,
        "content_type": db_file.content_type,
        "has_password": db_file.password_hash is not None,
        "expires_at": db_file.expires_at
    }

@router.post("/public/{short_code}/verify")
def verify_password(short_code: str, req: FileVerifyRequest, request: Request, db: Session = Depends(get_db)):
    """Verify password and return a temporary token to actually download it"""
    db_file = db.query(FileShare).filter(FileShare.short_code == short_code).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    if not db_file.password_hash:
        return {"status": "ok", "token": "not_required"}
        
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"{short_code}_{client_ip}"
    
    rate_data = RATE_LIMITS[rate_key]
    if rate_data["locked_until"] and datetime.utcnow() < rate_data["locked_until"]:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Locked for 15 minutes.")
        
    if not req.password or req.password != db_file.password_hash:
        rate_data["attempts"] += 1
        if rate_data["attempts"] >= 5:
            rate_data["locked_until"] = datetime.utcnow() + timedelta(minutes=15)
        raise HTTPException(status_code=401, detail="Incorrect password")
        
    # Success, clear rate limits
    if rate_key in RATE_LIMITS:
        del RATE_LIMITS[rate_key]
        
    # In a real app we'd generate a temporary JWT here. For simplicity, we'll return a basic hash
    return {"status": "ok", "token": "verified"}

from fastapi.responses import FileResponse
@router.get("/download/{short_code}")
def download_file(short_code: str, token: str = None, db: Session = Depends(get_db)):
    """Actual download endpoint"""
    db_file = db.query(FileShare).filter(FileShare.short_code == short_code).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    if db_file.expires_at and datetime.utcnow() > db_file.expires_at:
        db.delete(db_file)
        db.commit()
        raise HTTPException(status_code=410, detail="This file link has expired and was deleted")
        
    if db_file.password_hash:
        if token != "verified":
            raise HTTPException(status_code=403, detail="Password required")
            
    # Increment download counter
    db_file.downloads += 1
    db.commit()
    
    return FileResponse(
        path=db_file.file_path,
        filename=db_file.filename,
        media_type=db_file.content_type
    )
