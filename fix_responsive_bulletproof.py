import re
file = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Fix the main tag to enforce no horizontal overflow
c = c.replace(
    '<main className="max-w-5xl mx-auto pt-16 px-4 pb-12">',
    '<main className="max-w-5xl mx-auto pt-16 px-4 pb-12 w-full overflow-hidden sm:overflow-visible">'
)

# 2. Fix the header alignment (they didn't like items-start)
c = c.replace(
    'className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4"',
    'className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-6 w-full text-center md:text-left"'
)

# 3. Ensure the buttons in the header wrap properly and look good centered
c = c.replace(
    '<div className="flex flex-wrap items-center gap-3">',
    '<div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">'
)

# 4. Make the file upload box incredibly responsive
c = c.replace(
    'className={`bg-white border-2 border-dashed rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-center text-center transition-all h-[400px]',
    'className={`bg-white border-2 border-dashed rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-center text-center transition-all min-h-[350px] w-full box-border'
)

# 5. Make the file list row incredibly responsive
c = c.replace(
    'className="bg-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"',
    'className="bg-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 group border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all w-full"'
)

# 6. Make the right side buttons in the file list centered on mobile
c = c.replace(
    '<div className="flex items-center gap-4 shrink-0 sm:pl-4 w-full sm:w-auto justify-end">',
    '<div className="flex items-center gap-4 shrink-0 sm:pl-4 w-full sm:w-auto justify-center sm:justify-end">'
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
