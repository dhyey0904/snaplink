import re

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add targetSizeKb state
c = c.replace("const [level, setLevel] = useState<CompressionLevel>('recommended');", "const [level, setLevel] = useState<CompressionLevel>('recommended');\n  const [targetSizeKb, setTargetSizeKb] = useState<number>(100);")

# Update CompressionLevel type
c = c.replace("type CompressionLevel = 'recommended' | 'extreme' | 'less';", "type CompressionLevel = 'recommended' | 'extreme' | 'less' | 'target';")

# Replace the grid-cols-3 with grid-cols-4
c = c.replace('className="grid grid-cols-1 md:grid-cols-3 gap-4"', 'className="grid grid-cols-1 md:grid-cols-4 gap-4"')

# Inject the 4th option inside the grid
pattern = r'(<label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors \$\{level === \'less\'.*?<\/label>)'
match = re.search(pattern, c, re.DOTALL)

target_option = """<label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'target' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'target'} onChange={() => setLevel('target')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Target Size</span>
                  </div>
                  {level === 'target' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" min="10" value={targetSizeKb} onChange={(e) => setTargetSizeKb(Number(e.target.value))} className="w-full border border-green-300 rounded p-1 text-sm outline-none bg-white" />
                      <span className="text-xs font-bold text-gray-500">KB</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 ml-6">Specify exact size</span>
                  )}
                </label>"""

c = c[:match.end()] + "\n                " + target_option + c[match.end():]

# In compressFile, append targetSizeKb
api_start = "formData.append('level', level);"
c = c.replace(api_start, api_start + "\n      if (level === 'target') formData.append('targetSizeKb', targetSizeKb.toString());")

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Added target size to frontend")
