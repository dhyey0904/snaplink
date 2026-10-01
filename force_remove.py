import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Use regex to match the exact block and remove it
c = re.sub(r'<div className="flex items-center gap-4">.*?</div>\s*</div>', '', c, flags=re.DOTALL)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Forcibly removed block")
