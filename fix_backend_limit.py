import re

file = 'backend/app/api/bridge.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add a limit check to upload_transfer
replacement = """
    file_id = str(uuid.uuid4())
"""

check = """
    # Enforce 50MB limit on backend
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 50MB limit.")

    file_id = str(uuid.uuid4())
"""

c = c.replace(replacement, check)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Enforced 50MB limit in backend")
