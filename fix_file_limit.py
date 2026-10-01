import re

file = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('if (file.size > 100 * 1024 * 1024) {', 'if (file.size > 50 * 1024 * 1024) {')
c = c.replace('alert("File exceeds 100MB limit.");', 'alert("File exceeds 50MB limit.");')
c = c.replace('Up to 100MB per file. Supports all formats.', 'Up to 50MB per file. Supports all formats.')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Enforced 50MB limit in frontend")
