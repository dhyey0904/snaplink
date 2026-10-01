import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove "Blank" text
c = c.replace('<div className="flex items-center justify-center h-full opacity-10 italic text-sm">Blank</div>', '<div></div>')

# 2. Fix the padding on images to align them better
c = c.replace('className="flex-1 flex flex-col items-center justify-center pb-8"', 'className="flex-1 flex flex-col items-center justify-center pb-4"')

# 3. Update the CSS for book-p to properly justify
c = c.replace(
    'text-align: left;',
    'text-align: justify;\n          hyphens: auto;\n          -webkit-hyphens: auto;\n          word-spacing: -0.02em;'
)

# 4. Make sure flipbook height is flexible enough or responsive
# The flipbook is width={450} height={650} on desktop.
c = c.replace('height={isMobile ? window.innerHeight - 150 : 650}', 'height={isMobile ? window.innerHeight - 150 : 680}')
c = c.replace('maxHeight={900}', 'maxHeight={1000}')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
