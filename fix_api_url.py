import os
import re

dir_path = 'frontend/src'

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                c = f.read()
            
            # If the file uses NEXT_PUBLIC_API_URL, we'll replace it
            if 'NEXT_PUBLIC_API_URL' in c:
                c = c.replace("process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'", "`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api`")
                c = c.replace("process.env.NEXT_PUBLIC_API_URL", "`${process.env.NEXT_PUBLIC_BACKEND_URL}/api`")
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(c)

print("Fixed API URLs")
