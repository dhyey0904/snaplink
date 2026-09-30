import re

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace desktop
old_desktop = 'className="text-[14px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors"'
new_desktop = 'className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-[#1557b0] transition-colors"'
c = c.replace(old_desktop + '>SnapBridge', new_desktop + '>SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">New</span>')

# Replace mobile
old_mobile = 'className="block px-3 py-3 text-base font-bold text-blue-600 hover:bg-blue-50 rounded-lg"'
new_mobile = 'className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"'
c = c.replace(old_mobile + '>SnapBridge', new_mobile + '>SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">New</span>')

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Navbar updated")
