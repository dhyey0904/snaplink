import os
import uuid
import time
import io
import threading
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
import aiofiles
from PIL import Image, ImageOps
import pillow_avif  # enables AVIF support in Pillow

router = APIRouter()

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "images")
COMPRESSED_DIR = os.path.join(os.getcwd(), "compressed", "images")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(COMPRESSED_DIR, exist_ok=True)

# Cleanup background thread
def cleanup_old_files():
    while True:
        try:
            now = time.time()
            for directory in [UPLOAD_DIR, COMPRESSED_DIR]:
                if not os.path.exists(directory):
                    continue
                for filename in os.listdir(directory):
                    filepath = os.path.join(directory, filename)
                    if os.path.isfile(filepath):
                        if os.stat(filepath).st_mtime < now - 1800:
                            os.remove(filepath)
        except Exception as e:
            print(f"Cleanup error: {e}")
        time.sleep(300)

thread = threading.Thread(target=cleanup_old_files, daemon=True)
thread.start()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

def process_image(
    input_path: str,
    output_path: str,
    output_format: str,
    mode: str,
    quality: int,
    target_size_kb: Optional[int],
    resize_width: Optional[int],
    resize_height: Optional[int],
    keep_metadata: bool
):
    start_time = time.time()
    
    with Image.open(input_path) as img:
        original_format = img.format
        if not keep_metadata:
            # Strip EXIF by re-creating the image
            data = list(img.getdata())
            img_without_exif = Image.new(img.mode, img.size)
            img_without_exif.putdata(data)
            img = img_without_exif

        # Handle resize
        if resize_width or resize_height:
            w = resize_width or img.width
            h = resize_height or img.height
            img = img.resize((w, h), Image.Resampling.LANCZOS)
        
        # Ensure format is compatible
        if output_format.upper() == 'JPG':
            output_format = 'JPEG'
        
        target_fmt = output_format.upper() if output_format.lower() != 'original' else (original_format or 'JPEG')
        
        # Convert RGBA to RGB for JPEG
        if target_fmt == 'JPEG' and img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # Smart Compress logic
        if mode == 'smart':
            quality = 85
            optimize = True
        else:
            optimize = True

        best_buffer = io.BytesIO()

        if mode == 'target' and target_size_kb:
            target_bytes = target_size_kb * 1024
            low, high = 10, 95
            best_q = 80
            
            # Binary search for best quality that fits in target size
            for _ in range(7):
                mid = (low + high) // 2
                temp_buf = io.BytesIO()
                kwargs = {'format': target_fmt, 'quality': mid, 'optimize': True}
                if target_fmt == 'PNG':
                    kwargs['compress_level'] = 9
                img.save(temp_buf, **kwargs)
                
                size = temp_buf.tell()
                if size <= target_bytes:
                    best_buffer = temp_buf
                    best_q = mid
                    low = mid + 1
                else:
                    high = mid - 1
            
            if best_buffer.tell() == 0:
                # If we couldn't get it small enough, just use the lowest quality checked
                img.save(best_buffer, format=target_fmt, quality=10, optimize=True)
                best_q = 10
            quality = best_q
        else:
            kwargs = {'format': target_fmt, 'quality': quality, 'optimize': optimize}
            if target_fmt == 'PNG':
                kwargs['compress_level'] = 9 # Max compression for PNG
            img.save(best_buffer, **kwargs)
        
        with open(output_path, 'wb') as f:
            f.write(best_buffer.getvalue())
            
        end_time = time.time()
        
        return {
            "original_size": os.path.getsize(input_path),
            "compressed_size": best_buffer.tell(),
            "quality": quality,
            "dimensions": f"{img.width}x{img.height}",
            "format": target_fmt,
            "time_ms": int((end_time - start_time) * 1000)
        }

@router.post("/compress")
async def compress_image_endpoint(
    file: UploadFile = File(...),
    mode: str = Form("smart"), # smart, custom, target
    quality: int = Form(85),
    targetSizeKb: int = Form(None),
    outputFormat: str = Form("original"),
    resizeWidth: int = Form(None),
    resizeHeight: int = Form(None),
    keepMetadata: bool = Form(False)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file extension.")

    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")
    file.file.seek(0)

    file_id = str(uuid.uuid4())
    input_filename = f"{file_id}{ext}"
    input_filepath = os.path.join(UPLOAD_DIR, input_filename)

    async with aiofiles.open(input_filepath, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # Determine output extension
    out_ext = ext
    if outputFormat.lower() != 'original':
        out_ext = f".{outputFormat.lower()}"
        if out_ext == '.jpeg': out_ext = '.jpg'

    output_filename = f"{file_id}_compressed{out_ext}"
    output_filepath = os.path.join(COMPRESSED_DIR, output_filename)

    try:
        stats = process_image(
            input_path=input_filepath,
            output_path=output_filepath,
            output_format=outputFormat,
            mode=mode,
            quality=quality,
            target_size_kb=targetSizeKb,
            resize_width=resizeWidth,
            resize_height=resizeHeight,
            keep_metadata=keepMetadata
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

    original_name = os.path.splitext(file.filename)[0]
    
    saved_percentage = 0
    if stats["original_size"] > 0:
        saved_percentage = round((1 - (stats["compressed_size"] / stats["original_size"])) * 100, 1)

    return JSONResponse({
        "success": True,
        "fileName": f"{original_name}_compressed{out_ext}",
        "originalSize": stats["original_size"],
        "compressedSize": stats["compressed_size"],
        "savedPercentage": saved_percentage,
        "quality": stats["quality"],
        "outputFormat": stats["format"],
        "dimensions": stats["dimensions"],
        "compressionTimeMs": stats["time_ms"],
        "downloadUrl": f"/api/image/download/{output_filename}",
        "expiresIn": "30 minutes"
    })

@router.get("/download/{filename}")
async def download_compressed(filename: str):
    filepath = os.path.join(COMPRESSED_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found or expired")
    return FileResponse(filepath, filename=filename)
