import re

file_path = 'frontend/src/app/tools/compress-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const [targetSizeKb, setTargetSizeKb] = useState<number>(100);',
    'const [targetSizeKb, setTargetSizeKb] = useState<string>("100");'
)
content = content.replace(
    '<input type="number" min="10" value={targetSizeKb} onChange={(e) => setTargetSizeKb(Number(e.target.value))} className="w-full text-gray-900 placeholder-gray-700 font-medium border border-green-300 rounded p-1 text-sm outline-none bg-white" />',
    '<input type="number" min="10" placeholder="e.g. 100" value={targetSizeKb} onChange={(e) => setTargetSizeKb(e.target.value)} className="w-full text-gray-900 placeholder-gray-400 font-medium border border-green-300 rounded p-1 text-sm outline-none bg-white" />'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed compress-pdf state")
