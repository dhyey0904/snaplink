import re

file = 'frontend/src/app/bridge/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Create a secure, temporary workspace to share files with anyone, anywhere.', 'Create a secure, temporary workspace to share files (up to 50MB) with anyone, anywhere. Files self-destruct after download.')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added 50MB text to bridge landing")
