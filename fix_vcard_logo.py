import re

file = 'frontend/src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

replacement = """<img src="/icon.png" alt="SnapLinks Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />"""
c = c.replace('<span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500">S</span>', replacement)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Replaced S with icon.png")
