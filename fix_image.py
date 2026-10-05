import re

file_path = 'frontend/src/app/tools/image-compressor/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix targetSizeKb state
content = content.replace(
    'const [targetSizeKb, setTargetSizeKb] = useState<number>(500);',
    'const [targetSizeKb, setTargetSizeKb] = useState<string>("500");'
)

# Fix input onChange and placeholder
content = content.replace(
    '<input type="number" min="10" value={targetSizeKb} onChange={(e) => setTargetSizeKb(Number(e.target.value))} className="w-full text-gray-900 placeholder-gray-700 font-medium border border-gray-200 rounded p-1.5 text-sm outline-none" />',
    '<input type="number" min="10" placeholder="e.g. 500" value={targetSizeKb} onChange={(e) => setTargetSizeKb(e.target.value)} className="w-full text-gray-900 placeholder-gray-400 font-medium border border-gray-200 rounded p-1.5 text-sm outline-none" />'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed image-compressor")
