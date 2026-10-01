import re

file = 'frontend/src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('20+ Free Web Tools & File Sharing', 'Free Web Tools & Secure File Sharing')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed 20+ fake claim")
