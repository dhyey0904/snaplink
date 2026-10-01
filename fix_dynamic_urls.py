import re
import os

files = [
    'frontend/src/app/bio/[alias]/page.tsx',
    'frontend/src/app/v/[alias]/page.tsx',
    'frontend/src/app/[shortCode]/page.tsx',
    'frontend/src/app/f/[shortCode]/ClientFilePage.tsx',
    'frontend/src/app/v/[alias]/ClientVCardPage.tsx'
]

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        c = c.replace('"https://www.snaplinks.in"', 'process.env.NEXT_PUBLIC_APP_URL || "https://snaplinks.in"')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Replaced hardcoded frontendUrl in dynamic pages")
