import re
with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_str = 'className="flex-1 h-full overflow-hidden cursor-pointer pointer-events-auto"'
new_str = 'className="flex-1 h-full w-full p-4 pt-14 overflow-hidden cursor-pointer pointer-events-auto flex flex-col"'

content = content.replace(old_str, new_str)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added padding")
