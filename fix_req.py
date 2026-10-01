import re

file = 'backend/requirements.txt'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the broken utf-16 string
c = c.replace('h\x00t\x00t\x00p\x00x\x00>\x00=\x000\x00.\x002\x004\x00.\x000\x00\r\x00\n\x00', '')
c = c.replace('h t t p x > = 0 . 2 4 . 0 ', '')

# Add properly
if 'httpx>=0.24.0' not in c:
    c += '\nhttpx>=0.24.0\n'

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed requirements.txt")
