import re

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the entire compressSingle block
start_sig = 'const compressSingle = async (id: string) => {'
end_sig = '  const downloadZip = async () => {'

if start_sig in c and end_sig in c:
    s_idx = c.find(start_sig)
    e_idx = c.find(end_sig)
    
    new_func = """const compressFile = async (id: string) => {
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
    c = c[:s_idx] + new_func + c[e_idx:]

    with open('frontend/src/app/tools/compress-pdf/page.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Replaced compressSingle with compressFile")
else:
    print("Signatures not found")
