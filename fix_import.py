import re

file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Prepend the import at the very top
c = "import Image from 'next/image';\n" + c

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added import Image")
