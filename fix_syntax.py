import re

file = 'frontend/src/app/admin/settings/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

bad_line = """const res = await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}/api/admin/settings', {"""
good_line = """const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}/api/admin/settings`, {"""

c = c.replace(bad_line, good_line)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed syntax error in settings page")
