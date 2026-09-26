import re

with open("frontend/src/app/tools/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

new_tools = """  { id: 'jpg-to-png', name: 'JPG to PNG', desc: 'Convert JPG images to transparent PNGs instantly.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-purple-600', href: '/tools/jpg-to-png' },
  { id: 'png-to-jpg', name: 'PNG to JPG', desc: 'Convert PNG images to JPG format for smaller file sizes.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-indigo-600', href: '/tools/png-to-jpg' },
  { id: 'svg-to-png', name: 'SVG to PNG', desc: 'Convert vector SVG graphics into raster PNG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-fuchsia-600', href: '/tools/svg-to-png' },
"""

# Find the exact string using regex to be safe
content = re.sub(
    r"(  \{ id: 'numbers'.*?\})",
    new_tools + r"\1",
    content
)

with open("frontend/src/app/tools/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed hub page tools array")
