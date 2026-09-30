import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_link = """                {/* Mobile SnapTools Link (Landing Page Only) */}
                {!isAdmin && !isDashboard && (
                  <Link href="/tools" className="flex items-center gap-1 text-[13px] font-bold text-[#1557b0] mr-1">
                    SnapTools <span className="bg-blue-100 text-[#1557b0] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">Free</span>
                  </Link>
                )}"""

new_link = """                {/* Mobile SnapBridge Link (Landing Page Only) */}
                {!isAdmin && !isDashboard && (
                  <Link href="/bridge" className="flex items-center gap-1 text-[13px] font-bold text-gray-700 hover:text-[#1557b0] mr-1">
                    SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                )}"""

c = c.replace(old_link, new_link)

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Replaced SnapTools with SnapBridge in mobile navbar")
