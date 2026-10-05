import re

file_path = 'frontend/src/app/tools/protect-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'await pdfDoc.encrypt({',
    'await pdfDoc.encrypt({\n          userPassword: password.normalize("NFC"),\n          ownerPassword: password.normalize("NFC"),\n//'
)
# Wait, let's see how protect-pdf does encryption
