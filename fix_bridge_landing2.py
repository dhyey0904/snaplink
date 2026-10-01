import re

file = 'frontend/src/app/bridge/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Files self-destruct 60 seconds after download.', 'Files up to 50MB self-destruct 60 seconds after download.')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added 50MB text to bridge landing")
