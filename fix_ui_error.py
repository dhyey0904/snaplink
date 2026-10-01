import re

file = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add uploadError state
c = c.replace('const [error, setError] = useState<string | null>(null);', 'const [error, setError] = useState<string | null>(null);\n  const [uploadError, setUploadError] = useState<string | null>(null);')

# 2. Replace alert with setUploadError
c = c.replace('alert("File exceeds 50MB limit.");', 'setUploadError("This file exceeds the 50MB security limit. Please upload a smaller file.");')
c = c.replace('alert("Upload failed. Make sure the backend is running.");', 'setUploadError("Upload failed. Make sure the backend is running and the file is under 50MB.");')

# 3. Add the UI for the error message above the upload box
error_ui = """
            {/* Upload Zone */}
            <div className="md:col-span-1">
               {uploadError && (
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex justify-between items-center shadow-sm">
                   <div className="flex items-center gap-2">
                     <ShieldAlert size={18} />
                     <span className="font-semibold text-sm">{uploadError}</span>
                   </div>
                   <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-700 transition-colors">
                     <X size={18} />
                   </button>
                 </motion.div>
               )}
               <div 
"""

c = c.replace("""
            {/* Upload Zone */}
            <div className="md:col-span-1">
               <div 
""", error_ui)

# 4. Hide error when new upload starts
c = c.replace('setUploading(true);', 'setUploadError(null);\n    setUploading(true);')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added proper UI error handling with X button")
