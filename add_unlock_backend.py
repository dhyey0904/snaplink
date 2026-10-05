import re

file_path = 'backend/app/api/tools.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

unlock_route = """
@router.post("/unlock-pdf")
async def unlock_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...), password: str = Form(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
        
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(TEMP_DIR, f"{file_id}.pdf")
    unlocked_path = os.path.join(TEMP_DIR, f"{file_id}_unlocked.pdf")
    
    try:
        # Save uploaded PDF
        with open(pdf_path, "wb") as f:
            content_bytes = await file.read()
            f.write(content_bytes)
            
        import pymupdf
        doc = pymupdf.open(pdf_path)
        
        # Authenticate
        if doc.needs_pass:
            if not doc.authenticate(password):
                doc.close()
                cleanup_files(pdf_path)
                raise HTTPException(status_code=401, detail="Invalid password")
                
        # Save decrypted
        doc.save(unlocked_path)
        doc.close()
        
        background_tasks.add_task(cleanup_files, pdf_path, unlocked_path)
        
        original_name = file.filename.rsplit('.', 1)[0]
        return FileResponse(
            unlocked_path,
            media_type="application/pdf",
            filename=f"{original_name}_unlocked.pdf"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        cleanup_files(pdf_path, unlocked_path)
        raise HTTPException(status_code=500, detail=str(e))
"""

if '/unlock-pdf' not in content:
    content = content + "\n" + unlock_route

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added backend unlock route")
