import re
import os

files = ['frontend/src/app/login/page.tsx', 'frontend/src/app/register/page.tsx', 'frontend/src/app/forgot-password/page.tsx']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Fix the broken quote injection
        c = c.replace('overflow-y-auto" bg-white shadow-[20px_0_40px_rgba(0,0,0,0.1)]">', 'overflow-y-auto bg-white shadow-[20px_0_40px_rgba(0,0,0,0.1)]">')
        c = c.replace('overflow-y-auto" bg-white shadow-[20px_0_40px_rgba(0,0,0,0.1)]">', 'overflow-y-auto bg-white shadow-[20px_0_40px_rgba(0,0,0,0.1)]">')
        c = c.replace('overflow-y-auto" bg-white">', 'overflow-y-auto bg-white">')
        c = c.replace('overflow-y-auto" bg-white', 'overflow-y-auto bg-white')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Fixed syntax error")
