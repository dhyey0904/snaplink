import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Hide the top button on mobile
pattern1 = r'(<Link href="/bridge" className=")(inline-flex items-center gap-2 bg-\[#1557b0\] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">[\s\r\n]*Open a Secure Space)'
replacement1 = r'\1hidden lg:inline-flex items-center gap-2 bg-[#1557b0] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">\n                    Open a Secure Space'
c = re.sub(pattern1, replacement1, c)

# 2. Fix the bottom button to look like the desktop one (not w-full giant block)
pattern2 = r'<Link href="/bridge" className="w-full flex items-center justify-center gap-2 bg-\[#1557b0\] hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md text-lg">'
replacement2 = r'<Link href="/bridge" className="inline-flex items-center gap-2 bg-[#1557b0] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">'
c = re.sub(pattern2, replacement2, c)

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed duplicate button and styling")
