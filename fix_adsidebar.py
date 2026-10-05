import re
import os

file_path = 'frontend/src/components/AdSidebar.tsx'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the visible grey box
    content = content.replace(
        'className={`hidden xl:flex flex-col items-center justify-center relative bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shrink-0 ${heightClass} w-[300px] transition-all`}',
        'className={`hidden xl:flex flex-col items-center justify-center relative rounded-2xl overflow-hidden shrink-0 ${heightClass} w-[300px] transition-all`}'
    )
    content = content.replace(
        '<span className="absolute top-2 right-3 text-[10px] uppercase tracking-widest font-bold text-gray-300 pointer-events-none z-0">Advertisement</span>',
        ''
    )
    content = content.replace(
        '<span className="absolute top-2 right-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 pointer-events-none z-0">Advertisement</span>',
        ''
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed AdSidebar")
