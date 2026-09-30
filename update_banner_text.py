import re

files = ['frontend/src/app/tools/compress-pdf/page.tsx', 'frontend/src/app/tools/image-compressor/page.tsx']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Update banner text
    c = c.replace('Server Upgrading (Back by Oct 2)', 'Server Upgrading (Back Today Morning)')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Updated banner text to today morning")
