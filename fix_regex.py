import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the regex literal
c = c.replace(
    'replace(/\\n\\n/g, \'<br/><br/>\')',
    'replace(new RegExp("\\\\n\\\\n", "g"), "<br/><br/>")'
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
