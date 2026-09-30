import re

with open('frontend/src/app/b/[shortCode]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

delete_func = """
  const downloadFile = (fileId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const a = document.createElement('a');
    a.href = `${apiUrl}/bridge/download/${fileId}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setFiles(files.map(f => f.id === fileId ? {...f, status: 'downloaded', downloaded_at: new Date().toISOString()} : f));
  };

  const deleteFile = async (fileId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/bridge/file/${fileId}`, { method: 'DELETE' });
      // Optimistically remove it from UI
      setFiles(files.filter(f => f.id !== fileId));
    } catch(e) {
      console.error("Failed to delete file");
    }
  };
"""

c = c.replace("""
  const downloadFile = (fileId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const a = document.createElement('a');
    a.href = `${apiUrl}/bridge/download/${fileId}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Optimistically update status so timer shows
    setFiles(files.map(f => f.id === fileId ? {...f, status: 'downloaded', downloaded_at: new Date().toISOString()} : f));
  };""", delete_func)

# Now inject the delete button into the UI next to the download button
old_buttons = """<button onClick={() => downloadFile(file.id)} className="bg-white border border-gray-200 shadow-sm p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
                              <DownloadCloud size={20} />
                            </button>"""

new_buttons = """<div className="flex gap-2">
                              <button onClick={() => downloadFile(file.id)} className="bg-white border border-gray-200 shadow-sm p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-colors" title="Download">
                                <DownloadCloud size={20} />
                              </button>
                              <button onClick={() => deleteFile(file.id)} className="bg-white border border-red-100 shadow-sm p-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors" title="Delete">
                                <Trash2 size={20} />
                              </button>
                            </div>"""

c = c.replace(old_buttons, new_buttons)

with open('frontend/src/app/b/[shortCode]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Injected delete file button")
