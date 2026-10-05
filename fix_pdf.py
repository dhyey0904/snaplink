import re

file_path = 'frontend/src/app/tools/compress-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix targetSizeKb state
content = content.replace(
    'const [targetSizeKb, setTargetSizeKb] = useState(500);',
    'const [targetSizeKb, setTargetSizeKb] = useState<string>("500");'
)

# Fix input onChange and placeholder
content = content.replace(
    '<input type="number" value={targetSizeKb} onChange={(e) => setTargetSizeKb(Number(e.target.value))} className="w-24 px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500" min="10" />',
    '<input type="number" placeholder="e.g. 500" value={targetSizeKb} onChange={(e) => setTargetSizeKb(e.target.value)} className="w-24 px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500" min="10" />'
)

# Fix the backend fetch payload where it expects a string anyways (formData.append accepts string)
# If targetSizeKb is empty string, we should default to "500" or just not send it?
# In the payload: if (level === 'target') formData.append('targetSizeKb', targetSizeKb.toString());
# We can just leave it as is, targetSizeKb is a string now.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed compress-pdf")
