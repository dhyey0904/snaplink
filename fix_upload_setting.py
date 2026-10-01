import re

file = 'backend/app/api/bridge.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

imports = "from app.models.bridge import Transfer, BridgeRoom\nfrom app.models.settings import SystemSettings"
c = c.replace('from app.models.bridge import Transfer, BridgeRoom', imports)

old_check = """    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 50MB limit.")"""

new_check = """    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    settings = db.query(SystemSettings).first()
    max_mb = settings.max_upload_size_mb if settings else 50
    if file_size > max_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {max_mb}MB system limit.")"""

c = c.replace(old_check, new_check)
with open(file, 'w', encoding='utf-8') as f:
    f.write(c)


file2 = 'backend/app/api/files.py'
with open(file2, 'r', encoding='utf-8') as f:
    c2 = f.read()

imports2 = "from app.models.user import User\nfrom app.models.settings import SystemSettings"
c2 = c2.replace('from app.models.user import User', imports2)

old_check2 = """    # Read file size roughly
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)"""

new_check2 = """    # Read file size roughly
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    settings = db.query(SystemSettings).first()
    max_mb = settings.max_upload_size_mb if settings else 100
    if file_size > max_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {max_mb}MB system limit.")"""

c2 = c2.replace(old_check2, new_check2)
with open(file2, 'w', encoding='utf-8') as f:
    f.write(c2)

print("Enforced max_upload_size_mb setting in bridge and files")
