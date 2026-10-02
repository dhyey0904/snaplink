import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    original = c
    # Replace 'http://localhost:8000' (when it's the fallback)
    c = c.replace("'http://localhost:8000'", "'https://snaplink-x8i6.onrender.com'")
    c = c.replace('"http://localhost:8000"', '"https://snaplink-x8i6.onrender.com"')
    
    # Replace hardcoded http://localhost:8000 inside template literals
    c = c.replace("`http://localhost:8000", "`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}")
    c = c.replace("http://localhost:8000", "https://snaplink-x8i6.onrender.com")

    if c != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_in_file(os.path.join(root, file))

