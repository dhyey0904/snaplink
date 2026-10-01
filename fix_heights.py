import re
import os

files = ['frontend/src/app/login/page.tsx', 'frontend/src/app/register/page.tsx', 'frontend/src/app/forgot-password/page.tsx']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Ensure wrapper takes full height cleanly
        c = c.replace('min-h-[100dvh]', 'min-h-screen')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Fixed min-h-[100dvh] to min-h-screen")
