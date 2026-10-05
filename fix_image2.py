import re

file_path = 'frontend/src/app/tools/image-compressor/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const [targetSizeKb, setTargetSizeKb] = useState(100);',
    'const [targetSizeKb, setTargetSizeKb] = useState<string>("100");'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed targetSizeKb state")
