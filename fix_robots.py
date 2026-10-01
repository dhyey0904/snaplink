import re
file = 'frontend/src/app/robots.ts'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("const baseUrl = 'https://www.snaplinks.in';", "const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://snaplinks.in';")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
print("Fixed robots.ts")
