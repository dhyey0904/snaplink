import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Change it back to Purple!
c = c.replace('bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600')
c = c.replace('bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600', 'bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700')
c = c.replace('shadow-lg shadow-emerald-500/30', 'shadow-lg shadow-purple-500/30')
c = c.replace('bg-gradient-to-r from-emerald-400 to-teal-500', 'bg-gradient-to-r from-purple-500 to-pink-500')

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Reverted to Purple theme")
