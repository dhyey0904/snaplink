import re

file_path = 'frontend/src/app/tools/compress-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "if (level === 'target') formData.append('targetSizeKb', targetSizeKb.toString());",
    "if (level === 'target' && targetSizeKb) formData.append('targetSizeKb', targetSizeKb.toString());"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed compress-pdf payload")
