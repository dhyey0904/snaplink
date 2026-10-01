import re
import os

def fix_bio_aspect():
    file_path = 'frontend/src/app/dashboard/bio/page.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        c = f.read()

    original = 'className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-black p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto transform scale-90 sm:scale-100 origin-top"'
    new = 'className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[1/2.11] rounded-[3.5rem] bg-black p-[12px] sm:p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto"'
    
    if original in c:
        c = c.replace(original, new)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(c)
    else:
        print("Bio original not found")

def fix_vcard_aspect():
    file_path = 'frontend/src/app/dashboard/vcard/page.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        c = f.read()

    original = 'className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-gray-900 p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto border-4 border-gray-800 transform scale-90 sm:scale-100 origin-top"'
    new = 'className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[1/2.11] rounded-[3.5rem] bg-gray-900 p-[10px] sm:p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto border-4 border-gray-800"'
    
    if original in c:
        c = c.replace(original, new)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(c)
    else:
        print("Vcard original not found")

fix_bio_aspect()
fix_vcard_aspect()
print("Fixed aspect ratio for mockups")
