import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Change it back to 4!
c = c.replace('grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8', 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8')

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Reverted to 4 columns")
