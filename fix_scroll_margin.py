import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<section id="snaptools" className="py-24', '<section id="snaptools" className="scroll-mt-20 py-24')
c = c.replace('<section id="snapbridge" className="py-24', '<section id="snapbridge" className="scroll-mt-20 py-24')

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Added scroll-margin-top")
