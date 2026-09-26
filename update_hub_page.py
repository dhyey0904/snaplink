import re

with open("frontend/src/app/tools/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

new_tools = """    { id: 'jpg-to-png', name: 'JPG to PNG', desc: 'Convert JPG images to transparent PNGs instantly.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-purple-600', href: '/tools/jpg-to-png' },
    { id: 'png-to-jpg', name: 'PNG to JPG', desc: 'Convert PNG images to JPG format for smaller file sizes.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-indigo-600', href: '/tools/png-to-jpg' },
    { id: 'svg-to-png', name: 'SVG to PNG', desc: 'Convert vector SVG graphics into raster PNG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-fuchsia-600', href: '/tools/svg-to-png' },
"""

# Insert it before numbers
content = content.replace("    { id: 'numbers', name: 'Page Numbers', desc: 'Add page numbers into PDFs with ease.', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', color: 'bg-teal-500', href: '/tools/page-numbers' },", new_tools + "    { id: 'numbers', name: 'Page Numbers', desc: 'Add page numbers into PDFs with ease.', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', color: 'bg-teal-500', href: '/tools/page-numbers' },")

with open("frontend/src/app/tools/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added explicit tools to the hub page")
