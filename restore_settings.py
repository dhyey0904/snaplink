import re

file = 'backend/app/api/admin.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

settings_code = """from app.models.settings import SystemSettings
from pydantic import BaseModel

class SettingsUpdate(BaseModel):
    maintenance_mode: bool
    allow_registrations: bool
    max_upload_size_mb: int

@router.get("/settings")"""

c = c.replace('@router.get("/settings")', settings_code)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Restored SettingsUpdate")
