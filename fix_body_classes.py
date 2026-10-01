import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<body className="min-h-full flex flex-col overflow-x-hidden">', '<body className="min-h-screen flex flex-col overflow-x-hidden antialiased">')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed body classes")
