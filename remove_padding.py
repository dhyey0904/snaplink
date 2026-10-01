import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the padding logic
padding_logic = """  // Pad total pages to be even
  if (allPages.length % 2 !== 0) {
    allPages.push({ content: '', type: 'blank', chapterTitle: '' });
  }"""
c = c.replace(padding_logic, '')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
