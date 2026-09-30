import re

# 1. Remove Oct 2 from Tools Page
file_tools = 'frontend/src/app/tools/page.tsx'
with open(file_tools, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("title={tool.requiresServer ? 'Backend currently undergoing maintenance. Available Oct 2nd.' : ''}", "")
c = c.replace("{tool.requiresServer && (\n                  <span className=\"absolute -top-2 -right-6 bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap\">Oct 2</span>\n                )}", "")

with open(file_tools, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. Fix opacity on placeholders
files = ['frontend/src/app/tools/compress-pdf/page.tsx', 'frontend/src/app/tools/image-compressor/page.tsx']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Remove opacity-50 and use bg-gray-50 instead so it looks disabled but text is fully dark
    c = c.replace("opacity-50 pointer-events-none", "bg-gray-50 pointer-events-none cursor-not-allowed")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed tools page and opacity")
