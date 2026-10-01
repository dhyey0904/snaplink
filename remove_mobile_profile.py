import re

file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the block
old_block = '''                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <div className="flex items-center gap-3 px-3 pb-3">
                      <div className="w-8 h-8 bg-[#1557b0] text-white rounded-full flex items-center justify-center font-bold text-xs">U</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">User</span>
                        <span className="text-xs text-gray-700">Free Plan</span>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg">'''

new_block = '''                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button onClick={handleLogout} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg">'''

c = c.replace(old_block, new_block)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed mobile profile icon and Free Plan text")
