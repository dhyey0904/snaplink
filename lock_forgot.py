import re
import os

file = 'frontend/src/app/forgot-password/page.tsx'
if os.path.exists(file):
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('className="flex min-h-screen overflow-y-auto lg:h-screen lg:overflow-hidden w-full bg-white font-sans"', 'className="flex h-[100dvh] overflow-hidden w-full bg-white font-sans"')
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)
