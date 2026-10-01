import re

file = 'frontend/src/app/admin/settings/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

bad_line2 = """await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}/api/admin/settings', {"""
good_line2 = """await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}/api/admin/settings`, {"""

c = c.replace(bad_line2, good_line2)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed second syntax error in settings page")
