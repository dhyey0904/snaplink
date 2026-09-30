import re

file = 'frontend/src/app/tools/image-compressor/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'<select className=".*?" value=\{(.*?)\} onChange=\{(.*?)\} className="(.*?)"'
def repl(m):
    return f'<select value={{{m.group(1)}}} onChange={{{m.group(2)}}} className="{m.group(3)}"'

c = re.sub(pattern, repl, c)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed double classNames on select")
