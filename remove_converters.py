import re

# Clean Navbar.tsx
with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# We need to remove the whole sections "Convert to PDF" and "Convert from PDF" from Navbar
nav = re.sub(r'<div>\s*<div[^>]*>Convert to PDF</div>.*?</div>\s*</div>', '', nav, flags=re.DOTALL)
nav = re.sub(r'<div>\s*<div[^>]*>Convert from PDF</div>.*?</div>\s*</div>', '', nav, flags=re.DOTALL)

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)

# Clean tools/page.tsx
with open('frontend/src/app/tools/page.tsx', 'r', encoding='utf-8') as f:
    tools = f.read()

# Filter out tools with category "Convert to PDF", "Convert from PDF", "Image Converters"
# Look for objects in the TOOLS array
tools = re.sub(r"\{\s*category:\s*'Convert to PDF'.*?\},", "", tools, flags=re.DOTALL)
tools = re.sub(r"\{\s*category:\s*'Convert from PDF'.*?\},", "", tools, flags=re.DOTALL)
tools = re.sub(r"\{\s*category:\s*'Image Converters'.*?\},", "", tools, flags=re.DOTALL)

with open('frontend/src/app/tools/page.tsx', 'w', encoding='utf-8') as f:
    f.write(tools)

print("Removed all converter references")
