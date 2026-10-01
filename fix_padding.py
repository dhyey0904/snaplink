import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose"',
    'className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose pb-12"'
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
