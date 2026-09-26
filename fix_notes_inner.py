import re
with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make Notes inner transparent since wrapper is now yellow
content = content.replace(
    '<div className="flex flex-col h-full bg-[#fefce8]">',
    '<div className="flex flex-col h-full bg-transparent">'
)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned up inner Notes background")
