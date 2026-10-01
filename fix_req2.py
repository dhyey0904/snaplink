import re

file = 'backend/requirements.txt'
with open(file, 'rb') as f:
    c = f.read().decode('utf-8', errors='ignore')

# Remove any weird null bytes
c = c.replace('\x00', '')

# Remove multiple httpx declarations if any
c = re.sub(r'httpx.*?(\n|$)', '', c, flags=re.IGNORECASE)
c = re.sub(r'h t t p x.*?(\n|$)', '', c, flags=re.IGNORECASE)

# Append clean httpx
c = c.strip() + '\nhttpx>=0.24.0\n'

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Cleaned requirements.txt")
