import re

with open("frontend/src/app/tools/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# The array has:
#   { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Extract all images contained in a PDF or convert each page to a JPG.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-yellow-500', href: '/tools/pdf-to-jpg' },
#   { id: 'jpg-to-pdf', name: 'JPG to PDF', desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-yellow-500', href: '/tools/jpg-to-pdf' },

# Let's remove the jpg-to-pdf line
content = re.sub(r"\s*\{\s*id:\s*'jpg-to-pdf'.*?\},", "", content)

with open("frontend/src/app/tools/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Removed duplicate tool")
