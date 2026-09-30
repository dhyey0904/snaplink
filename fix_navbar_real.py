with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

import re
start_str = "{/* Convert PDF Mega Menu */}"
end_str = "{/* All PDF Tools Dropdown */}"

start_idx = nav.find(start_str)
end_idx = nav.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_link = '<Link href="/tools/image-compressor" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">Image Compressor</Link>\n                \n                '
    nav = nav[:start_idx] + new_link + nav[end_idx:]
    with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
        f.write(nav)
    print("Replaced!")
else:
    print("Not found")

