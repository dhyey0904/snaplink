import os
import re

files = [
    'frontend/src/app/f/[shortCode]/ClientFilePage.tsx',
    'frontend/src/app/v/[alias]/ClientVCardPage.tsx'
]

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Replace the broken JSX
        c = c.replace(
            'href=process.env.NEXT_PUBLIC_APP_URL || "https://snaplinks.in"', 
            'href={process.env.NEXT_PUBLIC_APP_URL || "https://snaplinks.in"}'
        )
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Fixed JSX syntax errors")
