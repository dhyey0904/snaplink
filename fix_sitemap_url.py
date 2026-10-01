import re

file = 'frontend/src/app/sitemap.ts'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('/tools/pdf-page-numbers', '/tools/page-numbers')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed page-numbers url in sitemap")
