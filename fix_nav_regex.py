import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# Desktop replace (find SnapTools ... Free</span> \n </Link> \n <Link href="/play")
desktop_pattern = r'(SnapTools <span.*?</span>\s*</Link>)\s*(<Link href="/play" className="text-sm font-bold text-purple-600)'
nav = re.sub(desktop_pattern, r'\1\n                <Link href="/bridge" className="text-[14px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">SnapBridge</Link>\n                \2', nav)

# Mobile replace
mobile_pattern = r'(</Link>\s*<Link href="/play" className="block px-3 py-3 text-base font-bold text-purple-600)'
nav = re.sub(mobile_pattern, r'</Link>\n                  <Link href="/bridge" className="block px-3 py-3 text-base font-bold text-blue-600 hover:bg-blue-50 rounded-lg">SnapBridge</Link>\n                  <Link href="/play" className="block px-3 py-3 text-base font-bold text-purple-600', nav)

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)

print("Injected via Regex")
