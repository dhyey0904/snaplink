import re

with open('e:/snaplink/frontend/page_backup.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

fab_regex = r'      \{\/\* FAB for Mobile Preview \*\/\}[\s\S]*?<\/button>\s*\)\}\s*<\/div>\s*\);\s*\}'
if re.search(fab_regex, text):
    text = re.sub(fab_regex, '    </div>\n  );\n}', text)

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Restored original page.tsx without FAB!")
