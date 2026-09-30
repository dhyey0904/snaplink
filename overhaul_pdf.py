import re

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Rename Component & Types
c = c.replace('ImageCompressorPage', 'CompressPDFPage')
c = c.replace("type CompressionMode = 'smart' | 'custom' | 'target';", "type CompressionLevel = 'recommended' | 'extreme' | 'less';")
c = c.replace("const [mode, setMode] = useState<CompressionMode>('smart');", "const [level, setLevel] = useState<CompressionLevel>('recommended');")

# 2. Text Replacements
c = c.replace('Image Compressor', 'Compress PDF')
c = c.replace('Reduce file size by up to 90% while flawlessly preserving visual quality.', 'Optimize and reduce PDF file structure size instantly securely.')
c = c.replace('Compress Image', 'Compress PDF')
c = c.replace('Compress Images', 'Compress PDFs')
c = c.replace('Select Images', 'Select PDF Files')
c = c.replace('Click to browse or drop images', 'Click to browse or drop PDF files')
c = c.replace('Supports JPG, PNG, WebP, AVIF', 'Supports standard PDF documents')
c = c.replace('accept="image/*"', 'accept="application/pdf"')
c = c.replace('Image downloaded', 'PDF downloaded')

# 3. Settings Row Replacement
# Replace the entire Settings Row grid
settings_start = '{/* Settings Row */}'
settings_end = '{/* Upload Area */}'

s_idx = c.find(settings_start)
e_idx = c.find(settings_end)

new_settings = """{/* Settings Row */}
            <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Compression Level</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'recommended' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'recommended'} onChange={() => setLevel('recommended')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Recommended</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-6">Good compression, high quality</span>
                </label>
                
                <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'extreme' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'extreme'} onChange={() => setLevel('extreme')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Extreme</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-6">Max compression, lower quality</span>
                </label>

                <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'less' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'less'} onChange={() => setLevel('less')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Less</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-6">Minor compression, perfect quality</span>
                </label>
              </div>
            </div>

            """
            
c = c[:s_idx] + new_settings + c[e_idx:]

# 4. Remove unused state variables
c = re.sub(r'const \[quality, setQuality\] = useState\(85\);\n\s+', '', c)
c = re.sub(r'const \[targetSizeKb, setTargetSizeKb\] = useState\(100\);\n\s+', '', c)
c = re.sub(r"const \[outputFormat, setOutputFormat\] = useState\('original'\);\n\s+", '', c)
c = re.sub(r'const \[resizeWidth, setResizeWidth\] = useState<number \| "">\(""\);\n\s+', '', c)
c = re.sub(r'const \[keepMetadata, setKeepMetadata\] = useState\(true\);\n\s+', '', c)

# 5. Fix API Call
# Replace the formData appends
api_start = 'formData.append(\'file\', file.originalFile);'
api_end = 'const apiUrl = process.env.NEXT_PUBLIC_API_URL || \'http://localhost:8000/api\';'

a_s = c.find(api_start)
a_e = c.find(api_end)

if a_s != -1 and a_e != -1:
    c = c[:a_s + len(api_start)] + f"\n      formData.append('level', level);\n\n      " + c[a_e:]

# 6. Change API URL and processing response
c = c.replace('fetch(`${apiUrl}/image/compress`', 'fetch(`${apiUrl}/tools/compress-pdf`')

# Wait, the PDF API doesn't return JSON! It returns a raw blob!
# Let's see the old compress-pdf API fetch:
"""
      const response = await fetch('http://127.0.0.1:8000/api/tools/compress-pdf', {
        method: 'POST',
        body: formData,
      });
      const blob = await response.blob();
      setNewSize(blob.size);
      const url = URL.createObjectURL(blob);
"""
# I need to completely rewrite the `compressImage` function!
compress_func_start = 'const compressImage = async (id: string) => {'
compress_func_end = '  const downloadZip = async () => {'

cf_s = c.find(compress_func_start)
cf_e = c.find(compress_func_end)

new_compress_func = """const compressFile = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'compressing', errorMsg: undefined } : f));

    try {
      const formData = new FormData();
      formData.append('file', file.originalFile);
      formData.append('level', level);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/tools/compress-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Compression failed on the server');
      }

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'success',
        compressedUrl: downloadUrl,
        compressedSize: blob.size,
      } : f));
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', errorMsg: err.message } : f));
    }
  };

"""

c = c[:cf_s] + new_compress_func + c[cf_e:]

# Rename compressAll
c = c.replace('compressImage(file.id)', 'compressFile(file.id)')

# 7. Change Preview Image to SVG Icon
c = c.replace('<img src={file.previewUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0" />', '<div className="w-12 h-12 bg-red-50 text-red-500 rounded flex items-center justify-center border border-red-100 shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg></div>')

# 8. Change theme from Blue/Emerald to Green
c = c.replace('bg-[#1557b0]', 'bg-green-600')
c = c.replace('hover:bg-blue-700', 'hover:bg-green-700')
c = c.replace('text-[#1557b0]', 'text-green-600')
c = c.replace('bg-blue-50', 'bg-green-50')
c = c.replace('border-emerald-300 hover:bg-emerald-50', 'border-green-300 hover:bg-green-50')
c = c.replace('text-emerald-500', 'text-green-500')
c = c.replace('text-emerald-600', 'text-green-600')
c = c.replace('bg-emerald-100', 'bg-green-100')
c = c.replace('text-emerald-700', 'text-green-700')
c = c.replace('border-blue-500', 'border-green-500')

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Overhauled compress-pdf UI")
