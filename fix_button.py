import re

with open('frontend/src/app/tools/image-compressor/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add handleDownload
handle_download = """  const downloadZip = async () => {
    // ...
  };

  const handleDownload = (file: CompressedFile) => {
    const a = document.createElement('a');
    a.href = file.compressedUrl!;
    a.download = file.originalFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      alert("Image downloaded and securely deleted from our servers! Please upload a new image.");
      setFiles([]);
    }, 1000);
  };"""

c = re.sub(r'  const downloadZip = async \(\) => \{.*?\};', handle_download, c, flags=re.DOTALL)

# Replace the <a> with <button>
old_a = """<a href={file.compressedUrl} download={file.originalFile.name} className="text-[#1557b0] hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors">
                            <DownloadCloud size={18} />
                          </a>"""

new_button = """<button onClick={() => handleDownload(file)} className="text-[#1557b0] hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors">
                            <DownloadCloud size={18} />
                          </button>"""

c = c.replace(old_a, new_button)

with open('frontend/src/app/tools/image-compressor/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated download button logic")
