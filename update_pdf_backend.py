import re

with open('backend/app/api/tools.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace compress_pdf function
pattern = r'@router\.post\("/compress-pdf"\)[\s\S]*?background_tasks\.add_task\(cleanup_files, pdf_path, compressed_path\)'

replacement = """@router.post("/compress-pdf")
async def compress_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...), level: str = Form("recommended")):
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

        doc.save(
            compressed_path,
            **save_kwargs
        )
        doc.close()
        
        background_tasks.add_task(cleanup_files, pdf_path, compressed_path)"""

new_c = re.sub(pattern, replacement, c)

# Ensure Form is imported
if 'from fastapi import' in new_c and 'Form' not in new_c:
    new_c = new_c.replace('from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks, Response', 'from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks, Response, Form')

with open('backend/app/api/tools.py', 'w', encoding='utf-8') as f:
    f.write(new_c)

print("Updated backend API to support compression levels")
