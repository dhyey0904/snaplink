import re

file = 'frontend/src/app/dashboard/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the massive text
c = c.replace('text-6xl md:text-7xl font-black', 'text-4xl sm:text-5xl lg:text-7xl font-black')
# Fix the emoji typo
c = c.replace('dY`<', '👋')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed overview styling")
