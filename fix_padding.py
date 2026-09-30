import re

files = [
    'frontend/src/app/bridge/page.tsx',
    'frontend/src/app/b/[shortCode]/page.tsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace pt-24 with pt-12 (or similar)
    # The bridge landing page has: className="max-w-4xl mx-auto pt-24 pb-12 px-4"
    # The room page has: className="max-w-5xl mx-auto pt-24 px-4 pb-12"
    content = content.replace('pt-24', 'pt-16')
    content = content.replace('pt-32', 'pt-16') # The error screen
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated padding")
