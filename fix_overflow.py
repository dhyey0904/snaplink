import re
file = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the h1 that prevents wrapping
c = c.replace(
    '<h1 className="text-4xl md:text-5xl font-black text-gray-900 font-mono tracking-wider">Room: &nbsp;{shortCode}</h1>',
    '<h1 className="text-3xl md:text-5xl font-black text-gray-900 font-mono tracking-wider break-words flex flex-wrap gap-2"><span>Room:</span><span>{shortCode}</span></h1>'
)

# Reduce padding on the upload box for very small screens
c = c.replace(
    'p-8 flex flex-col',
    'p-4 sm:p-8 flex flex-col'
)

# Reduce padding on the files box
c = c.replace(
    'border border-gray-100 p-6 min-h-[400px]',
    'border border-gray-100 p-4 sm:p-6 min-h-[400px]'
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
