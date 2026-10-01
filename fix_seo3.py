import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the entire jsonLd object definition
c = re.sub(r'const jsonLd = \{.*?\};\n\n', '', c, flags=re.DOTALL)

# Remove the Script tag injecting jsonLd
c = re.sub(r'<Script\s*id="schema-org"\s*type="application/ld\+json"\s*dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(jsonLd\)\s*\}\}\s*/>\s*', '', c, flags=re.DOTALL)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed global SoftwareApplication JSON-LD from layout.tsx")
