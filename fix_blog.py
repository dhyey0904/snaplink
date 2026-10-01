import re

file1 = 'frontend/src/content/blog/how-to-share-large-files.md'
with open(file1, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('files larger than 50MB', 'files up to 50MB')

with open(file1, 'w', encoding='utf-8') as f:
    f.write(c)

file2 = 'frontend/src/content/blog/why-3d-digital-business-card.md'
with open(file2, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Join thousands of creators, founders, and professionals who are already using SnapLinks', 'Join modern creators, founders, and professionals who are using SnapLinks')

with open(file2, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed fake claims in blog posts")
