import re

# 1. Compress PDF
file1 = 'frontend/src/app/tools/compress-pdf/page.tsx'
with open(file1, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('text-green-500/70', 'text-green-800')
with open(file1, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. Image Compressor
file2 = 'frontend/src/app/tools/image-compressor/page.tsx'
with open(file2, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('text-emerald-500/70', 'text-emerald-800')
with open(file2, 'w', encoding='utf-8') as f:
    f.write(c)

# 3. SnapBridge Room
file3 = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file3, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('text-gray-500', 'text-gray-700')
with open(file3, 'w', encoding='utf-8') as f:
    f.write(c)

# 4. SnapBridge Landing (just in case they meant the input placeholder)
file4 = 'frontend/src/app/bridge/page.tsx'
with open(file4, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('className="w-full px-4 py-3 bg-gray-50', 'className="w-full px-4 py-3 bg-gray-50 placeholder-gray-600')
with open(file4, 'w', encoding='utf-8') as f:
    f.write(c)

print("Darkened placeholders")
