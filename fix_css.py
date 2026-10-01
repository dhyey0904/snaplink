import re

file = 'frontend/src/app/globals.css'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('}\n\nbody {', 'body {')
c = c.replace('}\n\n\n}', '}\n')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed CSS syntax error")
