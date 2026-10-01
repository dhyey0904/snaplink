import re

file = 'frontend/src/app/globals.css'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the prefers-color-scheme: dark block entirely
c = re.sub(r'@media \(prefers-color-scheme: dark\) \{[\s\S]*?\}', '', c)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed dark mode media query from globals.css")
