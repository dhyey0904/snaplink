import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# Desktop Dashboard
desktop_pattern = r'(<Link href="/tools" className=\{`text-sm font-medium transition-colors py-5 flex items-center gap-1 \$\{pathname === \'/tools\' \? \'text-\[\#1557b0\] border-b-2 border-\[\#1557b0\]\' : \'text-\[\#5f6368\] hover:text-\[\#202124\]\'\}`\}>\s*SnapTools\s*</Link>)'
desktop_insert = r'\1\n                  <Link href="/bridge" className={`text-sm font-medium transition-colors py-5 flex items-center gap-1 ${pathname.startsWith(\'/bridge\') || pathname.startsWith(\'/b/\') ? \'text-[#1557b0] border-b-2 border-[#1557b0]\' : \'text-[#5f6368] hover:text-[#202124]\'}`}>\n                    SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-0.5">New</span>\n                  </Link>'

nav = re.sub(desktop_pattern, desktop_insert, nav)

# Mobile Dashboard
mobile_pattern = r'(<Link href="/tools" onClick=\{\(\) => setIsMobileMenuOpen\(false\)\} className=\{`block px-3 py-3 text-base font-medium rounded-lg \$\{pathname === \'/tools\' \? \'bg-blue-50 text-blue-700\' : \'text-gray-700 hover:bg-gray-50\'\}`\}>SnapTools</Link>)'
mobile_insert = r'\1\n                  <Link href="/bridge" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg flex items-center justify-between ${pathname.startsWith(\'/bridge\') || pathname.startsWith(\'/b/\') ? \'bg-blue-50 text-blue-700\' : \'text-gray-700 hover:bg-gray-50\'}`}>\n                    <div className="flex items-center gap-2">SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">New</span></div>\n                  </Link>'

nav = re.sub(mobile_pattern, mobile_insert, nav)

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)
