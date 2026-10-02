import re
file = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix header flex layout
c = c.replace('className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4"', 'className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4"')

# Allow buttons to wrap on small screens
c = c.replace('<div className="flex items-center gap-3">', '<div className="flex flex-wrap items-center gap-3">')

# Make sure toast doesn't overflow horizontally on 320px screens
c = c.replace('className="fixed bottom-6 right-6 z-[100] bg-white border border-gray-200 shadow-2xl text-gray-900 px-5 py-4 rounded-2xl flex justify-between items-center min-w-[300px]"', 'className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-[100] bg-white border border-gray-200 shadow-2xl text-gray-900 px-5 py-4 rounded-2xl flex justify-between items-center md:min-w-[300px]"')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
