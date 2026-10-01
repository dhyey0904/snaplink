import re
import os

files = [
    'frontend/src/app/privacy/page.tsx',
    'frontend/src/app/terms/page.tsx'
]

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        c = c.replace('(www.snaplinks.in)', '(snaplinks.in)')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Fixed terms and privacy texts")
