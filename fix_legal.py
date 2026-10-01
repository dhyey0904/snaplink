import re
import os

files = ['frontend/src/app/privacy/page.tsx', 'frontend/src/app/terms/page.tsx', 'frontend/src/app/about/page.tsx', 'frontend/src/app/contact/page.tsx']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Add text-justify to prose
        if 'prose ' in c:
            c = c.replace('prose ', 'prose prose-p:text-justify prose-li:text-justify ')
        elif 'prose"' in c:
            c = c.replace('prose"', 'prose prose-p:text-justify prose-li:text-justify"')
        
        # Make sure the email is hello.snaplinks@gmail.com
        c = re.sub(r'[\w.-]+@snaplinks\.in', 'hello.snaplinks@gmail.com', c)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Updated text justification and emails on legal pages")
