import re

files = ['frontend/src/app/tools/compress-pdf/page.tsx', 'frontend/src/app/tools/image-compressor/page.tsx']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()

    # Fix double classNames
    pattern = r'className="text-gray-900 placeholder-gray-700 font-medium "\s+placeholder="(.*?)"\s+value=\{(.*?)\}\s+onChange=\{(.*?)\}\s+className="(.*?)"'
    
    def repl(m):
        return f'placeholder="{m.group(1)}" value={{{m.group(2)}}} onChange={{{m.group(3)}}} className="{m.group(4)}"'
        
    c = re.sub(pattern, repl, c)
    
    # Fix compress-pdf input which might also have double className
    pattern2 = r'className="text-gray-900 placeholder-gray-700 font-medium "\s+min="(.*?)"\s+value=\{(.*?)\}\s+onChange=\{(.*?)\}\s+className="(.*?)"'
    def repl2(m):
        return f'min="{m.group(1)}" value={{{m.group(2)}}} onChange={{{m.group(3)}}} className="{m.group(4)}"'
    
    c = re.sub(pattern2, repl2, c)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed double classNames")
