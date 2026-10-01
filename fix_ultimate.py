import re
import os

files = ['frontend/src/app/layout.tsx', 'frontend/src/config/site.ts']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        c = c.replace('The Ultimate All-in-One Digital Workspace', 'A Unified Digital Workspace')
        c = c.replace('The Ultimate All-in-One Utility Platform.', 'A unified utility platform for your digital needs.')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Fixed ultimate claims in layout and site config")
