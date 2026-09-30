import re

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Modify addFiles
add_files_orig = """  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    const newItems: CompressedFile[] = validFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      originalFile: f,
      originalSize: f.size,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newItems]);
  };"""

add_files_new = """  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (validFiles.length === 0) return;
    
    // Restrict to exactly one PDF at a time
    const singleFile = validFiles[0];
    const newItem: CompressedFile = {
      id: Math.random().toString(36).substring(7),
      originalFile: singleFile,
      originalSize: singleFile.size,
      status: 'pending'
    };
    
    // Overwrite the queue completely with the new file
    setFiles([newItem]);
  };"""

c = c.replace(add_files_orig, add_files_new)

with open('frontend/src/app/tools/compress-pdf/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Restricted to 1 PDF at a time")
