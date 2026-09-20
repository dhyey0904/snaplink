import os
import re

files_to_modify = [
    r"frontend\src\app\admin\page.tsx",
    r"frontend\src\app\page.tsx",
    r"frontend\src\app\dashboard\api\page.tsx",
    r"frontend\src\app\dashboard\analytics\[linkId]\page.tsx",
    r"frontend\src\app\dashboard\bio\page.tsx",
    r"frontend\src\app\dashboard\files\page.tsx",
    r"frontend\src\app\dashboard\page.tsx",
    r"frontend\src\app\dashboard\links\page.tsx",
    r"frontend\src\app\dashboard\vcard\page.tsx"
]

def refactor_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the <nav ...> ... </nav> block
    nav_pattern = re.compile(r'<nav.*?</nav>', re.DOTALL)
    
    if not nav_pattern.search(content):
        print(f"No <nav> found in {filepath}")
        return

    # Replace <nav> block with <Navbar />
    new_content = nav_pattern.sub('<Navbar />', content)

    # Add import Navbar from '@/components/Navbar';
    # Find the last import statement
    import_pattern = re.compile(r'(import .*?;\n)')
    imports = list(import_pattern.finditer(new_content))
    
    if imports:
        last_import = imports[-1]
        insert_pos = last_import.end()
        
        # Check if Navbar is already imported
        if "import Navbar" not in new_content:
            new_content = new_content[:insert_pos] + "import Navbar from '@/components/Navbar';\n" + new_content[insert_pos:]
    else:
        # If no imports exist, add at top
        # Check if 'use client' is at top
        if new_content.startswith("'use client';") or new_content.startswith('"use client";'):
            lines = new_content.split('\n')
            lines.insert(1, "\nimport Navbar from '@/components/Navbar';")
            new_content = '\n'.join(lines)
        else:
            new_content = "import Navbar from '@/components/Navbar';\n\n" + new_content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Refactored {filepath}")

for f in files_to_modify:
    refactor_file(os.path.join(r"e:\snaplink", f))
