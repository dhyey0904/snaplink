import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix totalPages
c = c.replace(
    '  if (allPages.length % 2 !== 0) {\n    allPages.push({ content: \'\', type: \'text\', chapterTitle: \'\' });\n  }',
    '  if (allPages.length % 2 !== 0) {\n    allPages.push({ content: \'\', type: \'text\', chapterTitle: \'\' });\n  }\n\n  const totalPages = allPages.length;'
)

# Fix HTMLFlipBook types by casting
c = c.replace(
    'import HTMLFlipBook from \'react-pageflip\';',
    'import HTMLFlipBook from \'react-pageflip\';\nconst FlipBook = HTMLFlipBook as any;'
)
c = c.replace(
    '<HTMLFlipBook ',
    '<FlipBook '
)
c = c.replace(
    '</HTMLFlipBook>',
    '</FlipBook>'
)


with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
