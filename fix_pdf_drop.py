import re

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix addFiles
c = c.replace("const validFiles = newFiles.filter(f => f.type.startsWith('image/'));", "const validFiles = newFiles.filter(f => f.type === 'application/pdf');")
# Allow multiple files
c = c.replace("setFiles([newItems[0]]); // Restrict to one image at a time", "setFiles(prev => [...prev, ...newItems]);")

# Fix handlePaste
c = c.replace("if (items[i].type.indexOf('image') !== -1) {", "if (items[i].type === 'application/pdf') {")

# Remove UploadCloud icon which might not be imported or replace with proper SVG
c = re.sub(r'<UploadCloud[^>]*/>', '<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>', c)

# Fix compressSingle -> compressFile
c = c.replace('compressSingle(file.id)', 'compressFile(file.id)')

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed addFiles and handlePaste")
