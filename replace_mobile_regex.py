import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'\{\/\* Mobile SnapTools Link \(Landing Page Only\) \*\/\}.*?</Link>\s*\}?\)'
replacement = """{/* Mobile SnapBridge Link (Landing Page Only) */}
              {!isAdmin && !isDashboard && (
                <Link href="/bridge" className="flex items-center gap-1 text-[13px] font-bold text-gray-700 hover:text-[#1557b0] mr-1">
                  SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">New</span>
                </Link>
              )"""

c = re.sub(pattern, replacement, c, flags=re.DOTALL)

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Actually replaced!")
