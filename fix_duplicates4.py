import re
with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Match the block exactly
pattern = r'''  const sensors = useSensors\([\s\S]*?\}\);\n    \}\n  \};\n'''

# Find all matches
matches = re.findall(pattern, content)

if len(matches) > 1:
    # Replace all with empty string
    content = content.replace(matches[0], "")
    # Add exactly one back
    content = content.replace("  const [newTaskText, setNewTaskText] = useState(\"\");", "  const [newTaskText, setNewTaskText] = useState(\"\");\n\n" + matches[0])

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
