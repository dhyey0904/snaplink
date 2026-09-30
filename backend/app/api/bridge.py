from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.database import get_db, SessionLocal
from app.models.bridge import Transfer
import shutil
import uuid
import os
import random
import string
import datetime
import asyncio

router = APIRouter()

BRIDGE_DIR = os.path.join("uploads", "bridge")
os.makedirs(BRIDGE_DIR, exist_ok=True)

def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@router.post("/upload")
async def upload_transfer(file: UploadFile = File(...), db: Session = Depends(get_db)):
    short_code = generate_short_code()
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{ext}"
    file_path = os.path.join(BRIDGE_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transfer = Transfer(
        id=file_id,
        short_code=short_code,
        original_name=file.filename,
        file_path=file_path,
        mime_type=file.content_type,
        size=os.path.getsize(file_path),
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(hours=24) # Fallback expiry
    )
    db.add(transfer)
    db.commit()

    return {"success": True, "shortCode": short_code}

@router.get("/status/{short_code}")
async def get_status(short_code: str, db: Session = Depends(get_db)):
    transfer = db.query(Transfer).filter(Transfer.short_code == short_code).first()
    if not transfer:
        return {"status": "deleted"}
    
    return {
        "status": transfer.status,
        "original_name": transfer.original_name,
        "size": transfer.size,
        "downloaded_at": transfer.downloaded_at.isoformat() if transfer.downloaded_at else None
    }

def delete_transfer_task(transfer_id: str, file_path: str):
    # Wait 60 seconds
    # Actually, we shouldn't do time.sleep in a background task blocking a worker.
    # We can use asyncio.sleep if the background task is async.
    pass

async def async_delete_transfer(transfer_id: str, file_path: str):
    await asyncio.sleep(60)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except:
        pass
    
    db = SessionLocal()
    try:
        t = db.query(Transfer).filter(Transfer.id == transfer_id).first()
        if t:
            t.status = "deleted"
            db.commit()
    finally:
        db.close()

@router.get("/download/{short_code}")
async def download_transfer(short_code: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    transfer = db.query(Transfer).filter(Transfer.short_code == short_code).first()
    if not transfer or transfer.status == "deleted":
        raise HTTPException(status_code=404, detail="Transfer expired or deleted")

    if transfer.status == "waiting":
        transfer.status = "downloaded"
        transfer.downloaded_at = datetime.datetime.utcnow()
        db.commit()
        
        # Schedule deletion in 60s
        background_tasks.add_task(async_delete_transfer, transfer.id, transfer.file_path)

    return FileResponse(transfer.file_path, filename=transfer.original_name)
