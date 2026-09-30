with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

import re
# We just want to replace the text "CONVERT PDF" with "IMAGE COMPRESSOR" in the secondary navbar, and the hover dropdown.
# Wait, replacing the whole dropdown with a single link to /tools/image-compressor is better.
# Let's find exactly the block.
start_str = "{/* Convert PDF Mega Menu */}"
end_str = "{/* All PDF Tools Mega Menu */}"

start_idx = nav.find(start_str)
end_idx = nav.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_link = '<Link href="/tools/image-compressor" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">Image Compressor</Link>\n                '
    nav = nav[:start_idx] + new_link + nav[end_idx:]

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)

print("Replaced!")
