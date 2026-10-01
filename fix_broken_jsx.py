import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the broken HTML replacement
c = re.sub(
    r'dangerouslySetInnerHTML=\{\{\s*__html: page\.content\.replace.*?\)\s*\}\} />',
    r'dangerouslySetInnerHTML={{ __html: page.content.replace(/# (.*)/g, \'<h1 class="text-3xl font-serif font-bold mb-6">$1</h1>\').replace(/## (.*)/g, \'<h2 class="text-2xl font-serif font-bold mb-4 mt-8">$1</h2>\').replace(/\\n\\n/g, \'<br/><br/>\') }} />',
    c,
    flags=re.DOTALL
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
