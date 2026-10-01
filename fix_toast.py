import re

file = 'frontend/src/app/b/[shortCode]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the inline error UI
c = re.sub(r'\{uploadError && \(\s*<motion\.div initial.*?\{uploadError\}\</span\>\s*\</div\>\s*\<button onClick.*?\</button\>\s*\</motion\.div\>\s*\)\}', '', c, flags=re.DOTALL)

# Add the floating toast UI right before the final closing div of the page
toast_ui = """
      {/* Floating Toast Popup for Errors */}
      <AnimatePresence>
        {uploadError && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] bg-white border border-gray-200 shadow-2xl text-gray-900 px-5 py-4 rounded-2xl flex justify-between items-center min-w-[300px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <span className="font-bold text-sm leading-tight">{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="ml-4 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
"""

c = c.replace('    </div>\n  );\n}', toast_ui + '\n  );\n}')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Changed error message to smooth floating toast popup")
