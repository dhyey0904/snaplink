import os

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    orig = c
    # Fix paddings
    c = c.replace('p-10', 'p-4 md:p-10')
    
    # In protect-pdf, there's a long placeholder too, maybe shorten it on mobile or ensure the input has w-full min-w-0
    c = c.replace(
        'placeholder="Enter the password required to open this PDF..."',
        'placeholder="Enter password..."'
    )
    c = c.replace(
        'placeholder="Enter a secure password to lock this PDF..."',
        'placeholder="Enter secure password..."'
    )

    if c != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)

tools_dir = 'frontend/src/app/tools'
for root, dirs, files in os.walk(tools_dir):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))

print("Fixed p-10 in all tools")
