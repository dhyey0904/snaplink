import re
file = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace row flex layout
old_row = 'className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"'
new_row = 'className="bg-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"'
c = c.replace(old_row, new_row)

# The right side buttons container needs to align to right or left on mobile. We'll make it w-full and flex justify-end on mobile, or just let it flow.
old_right = '<div className="flex items-center gap-4 shrink-0 pl-4">'
new_right = '<div className="flex items-center gap-4 shrink-0 sm:pl-4 w-full sm:w-auto justify-end">'
c = c.replace(old_right, new_right)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
