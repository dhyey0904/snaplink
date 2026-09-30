import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Revert the specific dark mode text that got too dark
c = c.replace('<div className="text-gray-700 text-base sm:text-sm">CEO, SnapLinks</div>', '<div className="text-gray-300 text-base sm:text-sm">CEO, SnapLinks</div>')
c = c.replace('<div className="text-gray-400 text-xs font-mono tracking-widest uppercase">Digital vCard</div>', '<div className="text-gray-300 text-xs font-mono tracking-widest uppercase">Digital vCard</div>')

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed vcard text contrast")
