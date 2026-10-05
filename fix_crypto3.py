import re

file_path = 'frontend/src/app/tools/protect-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const encryptedBytes = await encryptPDF(pdfBytes, password, password);',
    'const encryptedBytes = await encryptPDF(pdfBytes, password.normalize("NFC"), password.normalize("NFC"));'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed protect-pdf crypto normalization")
