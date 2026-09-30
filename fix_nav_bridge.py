import re
with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# Add link to SnapBridge in the main navbar next to SnapPlay or something
if 'SnapBridge' not in nav:
    nav = nav.replace('href="/play"', 'href="/bridge" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">SnapBridge</Link>\n              <Link href="/play"')

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)
