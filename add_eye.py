import re

file_path = 'frontend/src/app/tools/unlock-pdf/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add showPassword state
content = content.replace(
    'const [password, setPassword] = useState("");',
    'const [password, setPassword] = useState("");\n  const [showPassword, setShowPassword] = useState(false);'
)

# Replace input to support toggle
# Currently it looks like:
# <input 
#   type="password"
#   autoCapitalize="none" ...
#   value={password}
#   ... />

old_input_block = """<input 
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                autoComplete="off" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 font-medium text-gray-900"
                placeholder="Enter password..."
                disabled={!file}
              />"""

new_input_block = """<div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  autoComplete="off" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 font-medium text-gray-900"
                  placeholder="Enter password..."
                  disabled={!file}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>"""

content = content.replace(old_input_block, new_input_block)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added show password toggle to unlock-pdf")
