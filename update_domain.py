import re

with open("frontend/src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("https://snaplink.cc", "https://www.snaplinks.in")

with open("frontend/src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated domain in layout")
