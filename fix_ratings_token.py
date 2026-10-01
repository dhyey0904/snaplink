import re

file = 'frontend/src/app/admin/ratings/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("localStorage.getItem('snaplink_token')", "localStorage.getItem('token')")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed token key in ratings page")
