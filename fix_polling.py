import re
with open('frontend/src/app/b/[shortCode]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('setInterval(fetchFiles, 2000)', 'setInterval(fetchFiles, 500)')

with open('frontend/src/app/b/[shortCode]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
