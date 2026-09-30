import re

files = ['frontend/src/app/tools/compress-pdf/page.tsx', 'frontend/src/app/tools/image-compressor/page.tsx']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Remove the whole useEffect hook block
    pattern = r'  const \[isServerOffline, setIsServerOffline\] = useState\(false\);\n\n  useEffect\(\(\) => \{.*?\n  \}, \[\]\);'
    c = re.sub(pattern, '  const isServerOffline = true; // Hardcoded to true for now. Change to false in the morning.', c, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Hardcoded maintenance state")
