import re
file = 'frontend/src/app/sitemap.ts'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("'https://www.snaplinks.in'", "'https://snaplinks.in'")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
print("Fixed sitemap.ts")
