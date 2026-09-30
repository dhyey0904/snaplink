import re

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<input type="file" multiple ref={fileInputRef}', '<input type="file" ref={fileInputRef}')

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed multiple attribute")
