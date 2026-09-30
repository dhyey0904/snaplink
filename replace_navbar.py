import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# Replace the "Convert PDF Mega Menu" with an "Image Compressor" link
# The block starts at {/* Convert PDF Mega Menu */} and ends at {/* All PDF Tools Mega Menu */}
convert_pdf_block = re.search(r'\{\/\* Convert PDF Mega Menu \*\/\}.*?(?=\{\/\* All PDF Tools Mega Menu \*\/\})', nav, flags=re.DOTALL)

if convert_pdf_block:
    new_link = """<Link href="/tools/image-compressor" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">Image Compressor</Link>
                """
    nav = nav[:convert_pdf_block.start()] + new_link + nav[convert_pdf_block.end():]
    
with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)

print("Replaced CONVERT PDF in secondary navbar")
