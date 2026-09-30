import re

# 1. Compress PDF
file1 = 'frontend/src/app/tools/compress-pdf/page.tsx'
with open(file1, 'r', encoding='utf-8') as f:
    c = f.read()
# Replace wrapper
c = c.replace('<div className="text-green-600 font-bold flex flex-col items-center justify-center gap-2">', '<div className="flex flex-col items-center justify-center gap-2">')
# Replace title span
c = c.replace('<span className="text-lg">Click to browse or drop PDF files</span>', '<h3 className="text-gray-900 font-bold text-lg mb-1">Click to browse or drop PDF files</h3>')
# Replace subtitle span
c = c.replace('<span className="text-sm text-green-800 font-medium">Supports standard PDF documents</span>', '<p className="text-gray-700 text-sm font-medium">Supports standard PDF documents</p>')
with open(file1, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. Image Compressor
file2 = 'frontend/src/app/tools/image-compressor/page.tsx'
with open(file2, 'r', encoding='utf-8') as f:
    c = f.read()
# Replace wrapper
c = c.replace('<div className="text-emerald-600 font-bold flex flex-col items-center justify-center gap-2">', '<div className="flex flex-col items-center justify-center gap-2">')
# Replace title span
c = c.replace('<span className="text-lg">Click to browse or drop images</span>', '<h3 className="text-gray-900 font-bold text-lg mb-1">Click to browse or drop images</h3>')
# Replace subtitle span
c = c.replace('<span className="text-sm text-emerald-800 font-medium">Supports JPG, PNG, WebP, AVIF</span>', '<p className="text-gray-700 text-sm font-medium">Supports JPG, PNG, WebP, AVIF</p>')
with open(file2, 'w', encoding='utf-8') as f:
    f.write(c)

print("Standardized placeholders")
