from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.database import get_db, SessionLocal
from app.models.bridge import Transfer, BridgeRoom
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

@router.post("/room")
async def create_room(db: Session = Depends(get_db)):
    short_code = generate_short_code()
    room = BridgeRoom(
        room_code=short_code,
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    )
    db.add(room)
    db.commit()
    return {"success": True, "shortCode": short_code}

@router.post("/room/{short_code}/upload")
async def upload_transfer(short_code: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    room = db.query(BridgeRoom).filter(BridgeRoom.room_code == short_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{ext}"
    file_path = os.path.join(BRIDGE_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transfer = Transfer(
        id=file_id,
        room_code=short_code,
        original_name=file.filename,
        file_path=file_path,
        mime_type=file.content_type,
        size=os.path.getsize(file_path)
    )
    db.add(transfer)
    db.commit()

    return {"success": True, "fileId": file_id}

@router.get("/room/{short_code}/files")
async def list_files(short_code: str, db: Session = Depends(get_db)):
    room = db.query(BridgeRoom).filter(BridgeRoom.room_code == short_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
        
    transfers = db.query(Transfer).filter(Transfer.room_code == short_code).all()
    
    # Filter out deleted ones, just return waiting and downloaded
    active_transfers = []
    for t in transfers:
        if t.status != "deleted":
            active_transfers.append({
                "id": t.id,
                "original_name": t.original_name,
                "size": t.size,
                "status": t.status,
                "downloaded_at": t.downloaded_at.isoformat() if t.downloaded_at else None
            })
            
    return {"files": active_transfers}

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

@router.get("/download/{transfer_id}")
async def download_transfer(transfer_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    transfer = db.query(Transfer).filter(Transfer.id == transfer_id).first()
    if not transfer or transfer.status == "deleted":
        raise HTTPException(status_code=404, detail="Transfer expired or deleted")

    if transfer.status == "waiting":
        transfer.status = "downloaded"
        transfer.downloaded_at = datetime.datetime.utcnow()
        db.commit()
        
        # Schedule deletion in 60s
        background_tasks.add_task(async_delete_transfer, transfer.id, transfer.file_path)

    return FileResponse(transfer.file_path, filename=transfer.original_name)
