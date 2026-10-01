import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the version span
c = re.sub(r'<span className="px-2 py-0\.5 rounded bg-gray-100 border border-gray-200 text-xs text-gray-500 font-mono">v1\.0\.4</span>', '', c)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed version badge")
