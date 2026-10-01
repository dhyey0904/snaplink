import re

file = 'frontend/src/app/admin/settings/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("http://127.0.0.1:8000/admin/settings", "${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}/api/admin/settings")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed settings API URL")
