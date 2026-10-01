import re

file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Use regex to find and remove the profile div
c = re.sub(
    r'<div className="flex items-center gap-3 px-3 pb-3">.*?</div>\s*</div>',
    '',
    c,
    flags=re.DOTALL
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Regex removed mobile profile")
