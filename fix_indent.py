import re

with open('backend/app/main.py', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('\nfrom app.api import image\n', '\n    from app.api import image\n')

with open('backend/app/main.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed indentation")
