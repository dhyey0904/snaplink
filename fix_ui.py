import re

with open('frontend/src/app/tools/image-compressor/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace addFiles logic
c = c.replace(
    'setFiles(prev => [...prev, ...newItems]);',
    'setFiles([newItems[0]]); // Restrict to one image at a time'
)

# Remove multiple from input
c = c.replace('multiple accept="image/*"', 'accept="image/*"')

# Remove "Queue (X)" header
c = re.sub(
    r'<h3 className="font-bold text-gray-800">Queue \(\{files\.length\}\)</h3>',
    '<h3 className="font-bold text-gray-800">Ready to Compress</h3>',
    c
)

# Hide "Clear All" and "Download All ZIP" block, change to just Compress button
old_buttons = """<div className="flex justify-between items-center">
                  <button onClick={() => setFiles([])} className="text-sm font-bold text-gray-500 hover:text-red-500">Clear All</button>
                  {allDone && totalSaved > 0 ? (
                    <button onClick={downloadZip} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg">Download All ZIP</button>
                  ) : (
                    <button onClick={compressAll} disabled={isCompressing} className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isCompressing ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-[#1557b0] text-white hover:bg-blue-700'}`}>
                      {isCompressing ? 'Compressing...' : 'Compress Images'}
                    </button>
                  )}
                </div>"""

new_buttons = """<div className="flex justify-between items-center">
                  <button onClick={() => setFiles([])} className="text-sm font-bold text-gray-500 hover:text-red-500">Clear</button>
                  {!allDone && (
                    <button onClick={compressAll} disabled={isCompressing} className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${isCompressing ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-[#1557b0] text-white hover:bg-blue-700'}`}>
                      {isCompressing ? 'Compressing...' : 'Compress Image'}
                    </button>
                  )}
                </div>"""

c = c.replace(old_buttons, new_buttons)

with open('frontend/src/app/tools/image-compressor/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
print("Updated UI for single file")
