import re
import os

files = ['frontend/src/app/login/page.tsx', 'frontend/src/app/register/page.tsx', 'frontend/src/app/forgot-password/page.tsx']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Replace wrapper classes with fixed inset-0
        c = c.replace('className="flex h-[100dvh] overflow-hidden w-full bg-white font-sans"', 'className="fixed inset-0 flex w-full bg-white font-sans overflow-hidden"')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Pinned auth pages to fixed viewport")
