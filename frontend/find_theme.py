import re

with open('e:/snaplink/frontend/src/app/bio/[alias]/BioPageClient.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# find where themeType is used
for line in text.splitlines():
    if 'themeType' in line or 'theme_type' in line or 'color' in line.lower() or 'bg' in line.lower():
        print(line.strip())
