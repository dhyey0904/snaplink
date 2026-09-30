import re

hook_code = """  const [isServerOffline, setIsServerOffline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api`;
        const res = await fetch(`${apiUrl}/sitemap/bio`, { 
          method: 'GET',
          cache: 'no-store'
        });
        if (res.ok || res.status === 404 || res.status === 405 || res.status === 200) {
          setIsServerOffline(false);
        } else {
          setIsServerOffline(true);
        }
      } catch (e) {
        setIsServerOffline(true);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);"""

maintenance_ui = """              {isServerOffline && (
                <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center animate-pulse">
                  <div className="text-orange-600 mb-2 flex justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                  <h3 className="text-orange-800 font-bold text-xl mb-1">Server Upgrading (Back by Oct 2)</h3>
                  <p className="text-orange-700 font-medium text-sm">We are currently waiting for our high-speed compute servers to reboot for the new month. This page will automatically unlock as soon as the server is online.</p>
                </div>
              )}"""


# 1. Compress PDF
file1 = 'frontend/src/app/tools/compress-pdf/page.tsx'
with open(file1, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const [isDragging, setIsDragging] = useState(false);', 'const [isDragging, setIsDragging] = useState(false);\n' + hook_code)
c = c.replace('<main className="flex-grow max-w-3xl w-full">', '<main className="flex-grow max-w-3xl w-full">\n' + maintenance_ui)
# Disable inputs if offline
c = c.replace('disabled={files.some(f => f.status === \'compressing\')}', 'disabled={isServerOffline || files.some(f => f.status === \'compressing\')}')

with open(file1, 'w', encoding='utf-8') as f:
    f.write(c)


# 2. Image Compressor
file2 = 'frontend/src/app/tools/image-compressor/page.tsx'
with open(file2, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const [isDragging, setIsDragging] = useState(false);', 'const [isDragging, setIsDragging] = useState(false);\n' + hook_code)
c = c.replace('<main className="flex-grow max-w-3xl w-full">', '<main className="flex-grow max-w-3xl w-full">\n' + maintenance_ui)
# Disable inputs if offline
c = c.replace('disabled={files.some(f => f.status === \'compressing\')}', 'disabled={isServerOffline || files.some(f => f.status === \'compressing\')}')

with open(file2, 'w', encoding='utf-8') as f:
    f.write(c)


print("Added automatic maintenance banners")
