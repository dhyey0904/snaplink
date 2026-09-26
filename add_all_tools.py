import re

with open("frontend/src/app/tools/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# First, remove the 3 I added previously so we can add them all cleanly.
content = re.sub(r"  \{ id: 'jpg-to-png'.*?\n", "", content)
content = re.sub(r"  \{ id: 'png-to-jpg'.*?\n", "", content)
content = re.sub(r"  \{ id: 'svg-to-png'.*?\n", "", content)

# Now, let's create the array of ALL 13 tools
all_tools = """  { id: 'jpg-to-png', name: 'JPG to PNG', desc: 'Convert JPG images to transparent PNGs instantly.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-purple-500', href: '/tools/jpg-to-png' },
  { id: 'png-to-jpg', name: 'PNG to JPG', desc: 'Convert PNG images to JPG format for smaller file sizes.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-indigo-500', href: '/tools/png-to-jpg' },
  { id: 'jpg-to-webp', name: 'JPG to WEBP', desc: 'Convert JPG images to the modern WEBP format.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-blue-500', href: '/tools/jpg-to-webp' },
  { id: 'png-to-webp', name: 'PNG to WEBP', desc: 'Convert PNG images to highly optimized WEBP files.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-cyan-500', href: '/tools/png-to-webp' },
  { id: 'webp-to-jpg', name: 'WEBP to JPG', desc: 'Convert WEBP files back to universally supported JPGs.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-sky-500', href: '/tools/webp-to-jpg' },
  { id: 'webp-to-png', name: 'WEBP to PNG', desc: 'Convert WEBP files to high-quality transparent PNGs.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-emerald-500', href: '/tools/webp-to-png' },
  { id: 'bmp-to-jpg', name: 'BMP to JPG', desc: 'Convert large BMP files into compressed JPG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-amber-500', href: '/tools/bmp-to-jpg' },
  { id: 'bmp-to-png', name: 'BMP to PNG', desc: 'Convert large BMP files into standard PNG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-orange-500', href: '/tools/bmp-to-png' },
  { id: 'svg-to-png', name: 'SVG to PNG', desc: 'Convert vector SVG graphics into raster PNG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-fuchsia-500', href: '/tools/svg-to-png' },
  { id: 'svg-to-jpg', name: 'SVG to JPG', desc: 'Convert vector SVG graphics into raster JPG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-pink-500', href: '/tools/svg-to-jpg' },
  { id: 'avif-to-jpg', name: 'AVIF to JPG', desc: 'Convert modern AVIF images back to standard JPG format.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-rose-500', href: '/tools/avif-to-jpg' },
  { id: 'avif-to-png', name: 'AVIF to PNG', desc: 'Convert modern AVIF images into transparent PNGs.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-red-500', href: '/tools/avif-to-png' },
  { id: 'gif-to-png', name: 'GIF to PNG', desc: 'Extract the first frame of a GIF animation into a PNG image.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-violet-500', href: '/tools/gif-to-png' },
"""

content = re.sub(
    r"(  \{ id: 'numbers'.*?\})",
    all_tools + r"\1",
    content
)

with open("frontend/src/app/tools/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added ALL tools to hub page")
