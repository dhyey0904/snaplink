import re

file = 'frontend/src/app/login/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('setTimeout(() => redirectUser(result.access_token || data.access_token), 400);', 'setTimeout(() => redirectUser(localStorage.getItem("token") || ""), 400);')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed redirect reference error in login page")
