import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# Add to desktop Nav (non-dashboard)
nav = nav.replace(
    '</Link>\n                  <Link href="/play"',
    '</Link>\n                  <Link href="/bridge" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">SnapBridge</Link>\n                  <Link href="/play"'
)

# Add to mobile Nav (non-dashboard)
nav = nav.replace(
    '</Link>\n                  <Link href="/play"',
    '</Link>\n                  <Link href="/bridge" className="block px-3 py-3 text-base font-bold text-blue-600 hover:bg-blue-50 rounded-lg">SnapBridge</Link>\n                  <Link href="/play"'
)

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)
