import re
with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'star' in line.lower() or 'rating' in line.lower():
            print(f"{i+1}: {line.strip()}")
