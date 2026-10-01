import re
file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add SnapBook to main nav links
original_link = '<Link href="/about"'
new_link = '<Link href="/snapbook" className="text-gray-600 hover:text-black font-medium transition-colors text-sm">SnapBook<span className="ml-1 text-[9px] bg-[#1a4b3c] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider relative -top-2">Pro</span></Link>\n              <Link href="/about"'

if '<Link href="/snapbook"' not in c:
    c = c.replace(original_link, new_link)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)
