import re
file = 'backend/app/api/bridge.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the db.query with just a hardcoded 50MB check, or a local import
c = c.replace(
"""    settings = db.query(SystemSettings).first()
    max_mb = settings.max_upload_size_mb if settings else 50""",
"""    max_mb = 50"""
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
