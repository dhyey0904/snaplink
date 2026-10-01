import re
with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if '4.8' in line or '124' in line or '125' in line:
            print(f"{i+1}: {line.strip()}")
