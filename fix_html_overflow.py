import re

file_path = 'frontend/src/app/layout.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add overflow-x-hidden to html
content = content.replace(
    '<html lang="en">',
    '<html lang="en" className="overflow-x-hidden">'
)

# Ensure body has overflow-x-hidden and w-full
if 'overflow-x-hidden' not in content.split('<body')[1]:
    content = content.replace(
        '<body className="',
        '<body className="overflow-x-hidden w-full '
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed layout.tsx")
