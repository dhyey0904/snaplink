import re

file = 'frontend/src/app/manifest.ts'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('/icon?size=192', '/icon.png')
c = c.replace('/icon?size=512', '/icon.png')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed manifest.ts")
