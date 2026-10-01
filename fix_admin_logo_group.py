import re
file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('className="text-xl font-bold flex items-center gap-2 tracking-tight"', 'className="text-2xl font-bold flex items-center gap-2 tracking-tight group"')
with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
print("Added group class")
