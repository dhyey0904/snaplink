import re
import os

files = ['frontend/src/app/privacy/page.tsx', 'frontend/src/app/terms/page.tsx', 'frontend/src/app/about/page.tsx', 'frontend/src/app/contact/page.tsx']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Remove the text-justify classes
        c = c.replace('prose-p:text-justify prose-li:text-justify ', '')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

sec = 'frontend/src/app/security/page.tsx'
if os.path.exists(sec):
    with open(sec, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace(' text-justify', '')
    with open(sec, 'w', encoding='utf-8') as f:
        f.write(c)

print("Removed text-justify from all pages")
