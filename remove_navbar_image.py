import re

file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the Image component from the navbar
c = re.sub(r'<Image src="/icon\.png".*?/>\n\s*', '', c)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed Image from Navbar")
