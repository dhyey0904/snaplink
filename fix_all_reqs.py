import re

file = 'backend/requirements.txt'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

deps = ['pdf2docx>=0.5.8', 'pillow-avif-plugin>=1.4.6', 'pymupdf>=1.24.1']

for dep in deps:
    pkg = dep.split('>')[0]
    if pkg not in c and pkg.replace('-', '_') not in c:
        c = c.strip() + f'\n{dep}\n'

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added all missing dependencies")
