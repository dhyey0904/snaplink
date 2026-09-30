import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add SnapBridge and SnapTools to the unauthenticated mobile menu
unauth_mobile_start = """                <>
                <Link href="/play" className="block px-3 py-3 text-base font-bold text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>"""

new_unauth_mobile = """                <>
                <Link href="/tools" className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>SnapTools</Link>
                <Link href="/bridge" className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2">SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">New</span></div>
                </Link>
                <Link href="/play" className="block px-3 py-3 text-base font-bold text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>"""

if unauth_mobile_start in c:
    c = c.replace(unauth_mobile_start, new_unauth_mobile)
else:
    print("Could not find unauthenticated mobile menu block")

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Added SnapBridge and SnapTools to unauth mobile menu")
