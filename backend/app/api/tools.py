from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
import os
import uuid
from pdf2docx import Converter

router = APIRouter()

TEMP_DIR = "/tmp/snaptools" if os.name != 'nt' else os.path.join(os.environ.get('TEMP', 'C:\\temp'), 'snaptools')
os.makedirs(TEMP_DIR, exist_ok=True)

def cleanup_files(*file_paths):
    for path in file_paths:
        try:
            if os.path.exists(path):
                os.remove(path)
        except Exception as e:
            print(f"Cleanup error: {e}")

@router.post("/pdf-to-word")
async def pdf_to_word(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
        
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(TEMP_DIR, f"{file_id}.pdf")
    docx_path = os.path.join(TEMP_DIR, f"{file_id}.docx")
    
    try:
        # Save uploaded PDF
        with open(pdf_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # Convert to DOCX
        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
        cv.close()
        
        # Schedule cleanup after response is sent
        background_tasks.add_task(cleanup_files, pdf_path, docx_path)
        
        original_name = file.filename.rsplit('.', 1)[0]
        return FileResponse(
            docx_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{original_name}_converted.docx"
        )
        
    except Exception as e:
        cleanup_files(pdf_path, docx_path)
        raise HTTPException(status_code=500, detail=str(e))
import pymupdf

@router.post("/compress-pdf")
async def compress_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...), level: str = Form("recommended"), targetSizeKb: int = Form(None)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
        
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(TEMP_DIR, f"{file_id}.pdf")
    compressed_path = os.path.join(TEMP_DIR, f"{file_id}_compressed.pdf")
    
    try:
        # Save uploaded PDF
        with open(pdf_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        import pymupdf
        doc = pymupdf.open(pdf_path)
        
        # Configure save options based on level
        save_kwargs = {
            "garbage": 3,
            "deflate": True,
        }
        
        if level == "extreme":
            save_kwargs["garbage"] = 4
            save_kwargs["deflate_images"] = True
            save_kwargs["deflate_fonts"] = True
        elif level == "less":
            save_kwargs["garbage"] = 1
            save_kwargs["deflate"] = False
        elif level == "target":
            save_kwargs["garbage"] = 4
            save_kwargs["deflate_images"] = True
            save_kwargs["deflate_fonts"] = True
            # To strictly hit targetSizeKb, we would need to downsample images with PIL.
            # For now, we apply maximum possible structural compression.

        doc.save(
            compressed_path,
            **save_kwargs
        )
        doc.close()
        
        background_tasks.add_task(cleanup_files, pdf_path, compressed_path)
        
        original_name = file.filename.rsplit('.', 1)[0]
        return FileResponse(
            compressed_path,
            media_type="application/pdf",
            filename=f"{original_name}_compressed.pdf"
        )
        
    except Exception as e:
        cleanup_files(pdf_path, compressed_path)
        raise HTTPException(status_code=500, detail=str(e))
