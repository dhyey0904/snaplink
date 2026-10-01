import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Your ultimate web workspace', 'Your unified web workspace')
c = c.replace('Your ultimate digital workspace', 'Your unified digital workspace')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed ultimate in layout")
