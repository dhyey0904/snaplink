import re

file_path = 'backend/app/api/tools.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks',
    'from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Form import")
