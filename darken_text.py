import re

files = [
    'frontend/src/app/page.tsx',
    'frontend/src/app/bridge/page.tsx',
    'frontend/src/components/Navbar.tsx',
    'frontend/src/components/Footer.tsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()

    # Darken very light text
    c = c.replace('text-[#5f6368]', 'text-gray-800')
    c = c.replace('text-gray-500', 'text-gray-700')
    c = c.replace('text-gray-600', 'text-gray-800')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Darkened text")
