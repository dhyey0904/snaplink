with open('frontend/src/app/tools/compress-pdf/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Strip any BOM if present
if c.startswith('\ufeff'):
    c = c[1:]

if not c.startswith('"use client"'):
    # Try to find if it's there
    if '"use client"' in c:
        c = c.replace('"use client";\n', '')
        c = c.replace('"use client"\n', '')
    c = '"use client";\n\n' + c.lstrip()

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed use client")
