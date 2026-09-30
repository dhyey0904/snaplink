import re

file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add Image component import if not present
if "import Image" not in c:
    c = c.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Image from "next/image";')

# Inject the image into the logo link
logo_img = """              <Image src="/icon.png" alt="SnapLinks Logo" width={32} height={32} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl"""

c = c.replace('<span className="text-2xl', logo_img, 1)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added icon.png to Navbar")
