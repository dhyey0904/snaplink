import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('Timer\n} from "lucide-react";', 'Timer, Wrench\n} from "lucide-react";')

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Wrench import")
