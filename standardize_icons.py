import re

# 1. Compress PDF
file1 = 'frontend/src/app/tools/compress-pdf/page.tsx'
with open(file1, 'r', encoding='utf-8') as f:
    c = f.read()
# Replace icon styling
c = c.replace('<div className="w-12 h-12 bg-white rounded-full shadow border border-green-200 flex items-center justify-center text-green-500 mb-2">', '<div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">')
# SVG size
c = c.replace('<svg className="w-6 h-6" fill="none" stroke="currentColor"', '<svg className="w-8 h-8" fill="none" stroke="currentColor"')
with open(file1, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. Image Compressor
file2 = 'frontend/src/app/tools/image-compressor/page.tsx'
with open(file2, 'r', encoding='utf-8') as f:
    c = f.read()
# Replace icon styling
c = c.replace('<div className="w-12 h-12 bg-white rounded-full shadow border border-emerald-200 flex items-center justify-center text-emerald-500 mb-2">', '<div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">')
c = c.replace('<UploadCloud size={24} />', '<UploadCloud size={32} />')
with open(file2, 'w', encoding='utf-8') as f:
    f.write(c)

print("Standardized icons too")
