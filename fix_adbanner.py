import re

file_path = 'frontend/src/components/AdBanner.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make it invisible when empty
content = content.replace(
    'className="w-full max-w-[728px] mx-auto mt-10 mb-2 flex justify-center relative bg-gray-50 border border-gray-100 rounded-xl overflow-hidden min-h-[100px] xl:hidden"',
    'className="w-full max-w-[728px] mx-auto mt-10 mb-2 flex justify-center relative rounded-xl overflow-hidden xl:hidden min-h-[50px]"'
)
content = content.replace(
    '<span className="absolute top-1 right-2 text-[9px] uppercase tracking-wider font-bold text-gray-300 pointer-events-none z-0">Advertisement</span>',
    ''
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed AdBanner")
