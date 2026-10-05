import os

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    orig = c
    # Fix paddings
    c = c.replace('p-8', 'p-4 md:p-8')
    c = c.replace('p-6', 'p-4 md:p-6')
    
    # The string might get double replaced if we run it multiple times, but this is a one-time script.
    
    # Fix file rows in compress/image-compress
    c = c.replace(
        'className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-xl"',
        'className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-xl w-full"'
    )
    
    # In some places it might be <div className="flex gap-4 ...">
    
    # Fix any inputs or settings rows that might be too wide
    c = c.replace(
        '<label className="flex items-center gap-3">',
        '<label className="flex flex-wrap items-center gap-3 w-full">'
    )
    
    # Add overflow-hidden to main to prevent any accidental horizontal scroll on mobile, just like I did in bridge
    # Wait, main is inside a div, so let's add it to the body or the top level wrapper.
    c = c.replace(
        '<div className="min-h-screen bg-gray-50 font-sans">',
        '<div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">'
    )

    if c != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)

tools_dir = 'frontend/src/app/tools'
for root, dirs, files in os.walk(tools_dir):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))

print("Fixed all tools")
