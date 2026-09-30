import re

file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove 'use client'; and the import at the top
c = c.replace("import Image from 'next/image';\n'use client';\n", "")

# Re-add them in the correct order
c = "'use client';\nimport Image from 'next/image';\n" + c

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed use client order")
