import re

with open("frontend/src/app/tools/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

new_tool = ", { id: 'img2pdf', name: 'Image to PDF', desc: 'Convert JPG and PNG images into a PDF document.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-emerald-500', href: '/tools/image-to-pdf' }"
content = content.replace(" href: '/tools/split-pdf' },", " href: '/tools/split-pdf' }" + new_tool + ",")

with open("frontend/src/app/tools/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added tool to directory")
