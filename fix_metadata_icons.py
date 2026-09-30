import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the explicit icons block from metadata
pattern = r'\s*icons:\s*\{.*?\},\n'
c = re.sub(pattern, '\n', c, flags=re.DOTALL)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed explicit icons metadata")
