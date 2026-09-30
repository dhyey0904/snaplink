import re

with open('frontend/src/app/b/[shortCode]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix truncation for filename so it doesn't push buttons out of screen
c = c.replace('<div className="overflow-hidden">', '<div className="overflow-hidden min-w-0 flex-1">')
c = c.replace('<div className="flex items-center gap-4 overflow-hidden">', '<div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0">')

with open('frontend/src/app/b/[shortCode]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed room layout")
