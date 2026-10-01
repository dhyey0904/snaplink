import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

target = """            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AD
              </div>
            </div>"""

c = c.replace(target, "")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed AD avatar")
