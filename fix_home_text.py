import re

file = 'frontend/src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('SnapLinks is the ultimate all-in-one workspace. Convert images, manipulate PDFs, send self-destructing files, shorten URLs, and generate 3D business cards.', 'SnapLinks is a unified workspace. Compress images, edit PDFs, share files securely, shorten URLs, and create digital business cards.')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed exaggerated text on homepage")
