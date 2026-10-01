import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

target = """            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-xs font-mono text-green-700">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Systems Nominal
              </div>
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AD
              </div>
            </div>"""

replacement = """            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AD
              </div>
            </div>"""

c = c.replace(target, replacement)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed Systems Nominal badge")
