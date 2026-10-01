import re
import os

files = ['frontend/src/app/login/page.tsx', 'frontend/src/app/register/page.tsx']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Replace wrapper classes
        c = c.replace('className="flex min-h-screen overflow-y-auto lg:h-screen lg:overflow-hidden w-full bg-white font-sans"', 'className="flex h-[100dvh] overflow-hidden w-full bg-white font-sans"')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Locked scrolling on auth pages")
