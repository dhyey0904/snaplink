import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the first occurrence of `const addWidget = ... ` which is old
pattern1 = r'''  const addWidget = \(id: string\) => \{
    if \(!layout\.find\(w => w\.id === id\)\) \{
      saveLayout\(\[\.\.\.layout, \{ id, size: "medium", pinned: false, order: layout\.length \+ 1 \}\]\);
    \}
  \};\n+'''
content = re.sub(pattern1, "", content)

# Remove the first occurrence of `const removeWidget = ...` which is old
pattern2 = r'''  const removeWidget = \(id: string\) => \{
    saveLayout\(layout\.filter\(w => w\.id !== id\)\);
  \};\n+'''
content = re.sub(pattern2, "", content)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned up duplicates")
