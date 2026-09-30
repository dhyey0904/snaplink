import re

with open('backend/app/api/image.py', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("                if mode == 'target' and target_size_kb:", "        if mode == 'target' and target_size_kb:")

with open('backend/app/api/image.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed first line")
