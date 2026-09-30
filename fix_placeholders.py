import re

files = ['frontend/src/app/tools/compress-pdf/page.tsx', 'frontend/src/app/tools/image-compressor/page.tsx']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()

    # Make "KB" darker
    c = c.replace('text-gray-500">KB', 'text-gray-700">KB')
    
    # Make other text-gray-500 labels darker
    c = c.replace('text-gray-500 ml-6', 'text-gray-700 ml-6')
    c = c.replace('text-gray-500">', 'text-gray-700">')
    
    # Add text-gray-900 and placeholder-gray-700 to inputs and selects
    c = c.replace('<input type="number"', '<input type="number" className="text-gray-900 placeholder-gray-700 font-medium "')
    c = c.replace('className="w-full border', 'className="w-full text-gray-900 placeholder-gray-700 font-medium border')
    c = c.replace('<select', '<select className="text-gray-900 font-medium "')

    # Fix any double classNames that might result from the previous replace
    c = c.replace('className="text-gray-900 placeholder-gray-700 font-medium " className="', 'className="text-gray-900 placeholder-gray-700 font-medium ')
    c = c.replace('<select className="text-gray-900 font-medium " value', '<select className="text-gray-900 font-medium w-full border border-gray-200 bg-white rounded-xl p-3 text-sm focus:outline-none" value')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Darkened placeholders and inputs")
