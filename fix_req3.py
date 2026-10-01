import re

file = 'backend/requirements.txt'
with open(file, 'rb') as f:
    c = f.read().decode('utf-8', errors='ignore')

c = c.replace('\x00', '')
c = re.sub(r'aiofiles.*?(\n|$)', '', c, flags=re.IGNORECASE)
c = re.sub(r'a i o f i l e s.*?(\n|$)', '', c, flags=re.IGNORECASE)
c = c.strip() + '\naiofiles>=23.2.1\n'

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Cleaned requirements.txt and added aiofiles")
