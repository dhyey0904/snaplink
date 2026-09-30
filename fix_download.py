import re

with open('backend/app/api/image.py', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = """from fastapi.responses import FileResponse
from fastapi import BackgroundTasks
import glob

def delete_files_after_download(compressed_path: str, file_id: str):
    # Delete compressed file
    try:
        if os.path.exists(compressed_path):
            os.remove(compressed_path)
    except Exception as e:
        print(f"Error deleting compressed file: {e}")
        
    # Delete original file (find by prefix)
    try:
        pattern = os.path.join(UPLOAD_DIR, f"{file_id}.*")
        for f in glob.glob(pattern):
            os.remove(f)
    except Exception as e:
        print(f"Error deleting original file: {e}")

@router.get("/download/{filename}")
async def download_compressed(filename: str, background_tasks: BackgroundTasks):
    filepath = os.path.join(COMPRESSED_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found or expired")
    
    file_id = filename.split('_compressed')[0]
    background_tasks.add_task(delete_files_after_download, filepath, file_id)
    
    return FileResponse(filepath, filename=filename)"""

# Find the download endpoint and replace it
c = re.sub(r'@router\.get\("/download/\{filename\}"\).*?return FileResponse\(filepath, filename=filename\)', replacement, c, flags=re.DOTALL)

# We need to make sure BackgroundTasks and glob are imported if they aren't, but the replacement block adds imports (wait, putting imports inside the middle of the file is valid in python, but better at top. It's fine here)

with open('backend/app/api/image.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated download endpoint")
