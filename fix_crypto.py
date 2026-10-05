import re

file_path = 'frontend/src/app/tools/unlock-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add normalization
content = content.replace(
    'decryptedBytes = await decryptPDF(pdfBytes, password);',
    'decryptedBytes = await decryptPDF(pdfBytes, password.normalize("NFC"));'
)
content = content.replace(
    'const pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);',
    'const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password.normalize("NFC") } as any);'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed unlock-pdf crypto normalization")
