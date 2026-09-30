from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
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

ROOMS = {}
TRANSFERS = {}

def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@router.post("/room")
async def create_room():
    short_code = generate_short_code()
    ROOMS[short_code] = {
        "created_at": datetime.datetime.utcnow(),
        "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        "files": []
    }
    return {"success": True, "shortCode": short_code}

async def async_delete_unclaimed_transfer(transfer_id: str, file_path: str):
    await asyncio.sleep(180) # 3 minutes
    if transfer_id in TRANSFERS:
        t = TRANSFERS[transfer_id]
        if t["status"] == "waiting":
            # Nobody downloaded it in 3 minutes! Delete it.
            t["status"] = "deleted"
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except:
                pass

@router.post("/room/{short_code}/upload")
async def upload_transfer(short_code: str, background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if short_code not in ROOMS:
        ROOMS[short_code] = {
            "created_at": datetime.datetime.utcnow(),
            "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            "files": []
        }

    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{ext}"
    file_path = os.path.join(BRIDGE_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer, length=1024*1024)

    transfer_data = {
        "id": file_id,
        "room_code": short_code,
        "original_name": file.filename,
        "file_path": file_path,
        "mime_type": file.content_type,
        "size": os.path.getsize(file_path),
        "status": "waiting",
        "downloaded_at": None,
        "created_at": datetime.datetime.utcnow(),
        "expires_at": datetime.datetime.utcnow() + datetime.timedelta(minutes=3)
    }
    TRANSFERS[file_id] = transfer_data
    ROOMS[short_code]["files"].append(file_id)

    # Schedule the 3-minute auto-delete for unclaimed files
    background_tasks.add_task(async_delete_unclaimed_transfer, file_id, file_path)

    return {"success": True, "fileId": file_id}

@router.get("/room/{short_code}/files")
async def list_files(short_code: str):
    if short_code not in ROOMS:
        # Auto-recover the room if the backend restarted
        ROOMS[short_code] = {
            "created_at": datetime.datetime.utcnow(),
            "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            "files": []
        }
        
    room = ROOMS[short_code]
    if datetime.datetime.utcnow() > room["expires_at"]:
        raise HTTPException(status_code=404, detail="Room expired")
        
    active_transfers = []
    for fid in room["files"]:
        if fid in TRANSFERS:
            t = TRANSFERS[fid]
            if t["status"] != "deleted":
                active_transfers.append({
                    "id": t["id"],
                    "original_name": t["original_name"],
                    "size": t["size"],
                    "status": t["status"],
                    "downloaded_at": t["downloaded_at"].isoformat() if t["downloaded_at"] else None
                })
            
    return {"files": active_transfers}

async def async_delete_transfer(transfer_id: str, file_path: str):
    await asyncio.sleep(60)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except:
        pass
    
    if transfer_id in TRANSFERS:
        TRANSFERS[transfer_id]["status"] = "deleted"
        
@router.get("/download/{transfer_id}")
async def download_transfer(transfer_id: str, background_tasks: BackgroundTasks):
    if transfer_id not in TRANSFERS:
        raise HTTPException(status_code=404, detail="Transfer not found")
        
    transfer = TRANSFERS[transfer_id]
    if transfer["status"] == "deleted":
        raise HTTPException(status_code=404, detail="Transfer expired or deleted")

    if transfer["status"] == "waiting":
        transfer["status"] = "downloaded"
        transfer["downloaded_at"] = datetime.datetime.utcnow()
        
        # Schedule deletion in 60s
        background_tasks.add_task(async_delete_transfer, transfer_id, transfer["file_path"])

    return FileResponse(transfer["file_path"], filename=transfer["original_name"])
