import re

file = 'frontend/src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('A powerful suite of document and image tools that run entirely in your browser. Fast, secure, and limitless conversions with zero server uploads.', 'A convenient suite of document and image tools backed by our secure cloud infrastructure. Fast, reliable utility processing with standard encryption to keep your files safe.')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

tools = 'frontend/src/app/tools/page.tsx'
with open(tools, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('100% browser-based and secure.', 'Fast, reliable, and secure.')
c = c.replace('instantly in your browser.', 'instantly online.')

with open(tools, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed browser-based fake claims")
