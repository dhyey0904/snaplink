import re

file = 'backend/app/api/admin.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove users endpoint
c = re.sub(r'@router\.get\("/users"\)\ndef get_all_users.*?(?=@router\.get)', '', c, flags=re.DOTALL)

# Remove links endpoint
c = re.sub(r"@router\.get\('/links'\)\ndef get_all_links.*?(?=@router\.get)", '', c, flags=re.DOTALL)

# Remove files endpoint
c = re.sub(r"@router\.get\('/files'\)\ndef get_all_files.*?(?=@router\.get)", '', c, flags=re.DOTALL)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed users, links, and files endpoints")
