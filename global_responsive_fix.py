import os
import re

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content
    
    # We only want to replace CSS classes, so we can just replace ' p-8 ' -> ' p-4 md:p-8 ', etc.
    # But it might be at the start or end of a string or surrounded by quotes.
    # Using regex to target classes inside className="..." or className={`...`}
    
    def replace_class(text, old_class, new_class):
        # This regex looks for old_class surrounded by whitespace or quotes
        # It's safer to just do a smart string replacement on specific boundary patterns
        pattern = r'(?<![\w-])' + old_class + r'(?![\w-])'
        # We only want to do this if it's likely a Tailwind class
        return re.sub(pattern, new_class, text)

    content = replace_class(content, 'p-8', 'p-4 md:p-8')
    content = replace_class(content, 'p-10', 'p-5 md:p-10')
    content = replace_class(content, 'p-12', 'p-6 md:p-12')
    content = replace_class(content, 'px-8', 'px-4 md:px-8')
    content = replace_class(content, 'px-10', 'px-5 md:px-10')
    content = replace_class(content, 'px-12', 'px-6 md:px-12')
    content = replace_class(content, 'p-6', 'p-4 md:p-6')
    content = replace_class(content, 'px-6', 'px-4 md:px-6')

    # Fix grids that don't have md:
    # <div className="grid grid-cols-2 gap-8">
    content = content.replace('grid-cols-2', 'grid-cols-1 md:grid-cols-2')
    content = content.replace('grid-cols-3', 'grid-cols-1 md:grid-cols-3')
    # Except if it's already md:grid-cols-2 (it would become md:grid-cols-1 md:md:grid-cols-2)
    # Let's fix that artifact if it happens
    content = content.replace('md:grid-cols-1 md:md:grid-cols-', 'md:grid-cols-')
    content = content.replace('sm:grid-cols-1 md:sm:grid-cols-', 'sm:grid-cols-')

    if content != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {path}")

app_dir = 'frontend/src/app'
for root, dirs, files in os.walk(app_dir):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))

print("Global padding & grid fix completed")
