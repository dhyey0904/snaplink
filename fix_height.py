import re
import os

def fix_bio_aspect():
    file_path = 'frontend/src/app/dashboard/bio/page.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        c = f.read()

    original = 'className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[1/2.11] rounded-[3.5rem] bg-black p-[12px] sm:p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto"'
    new = 'className="relative h-[65vh] max-h-[650px] sm:h-auto sm:w-[340px] aspect-[1/2.11] rounded-[2.5rem] sm:rounded-[3.5rem] bg-black p-[8px] sm:p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto"'
    
    if original in c:
        c = c.replace(original, new)
        
        # Also fix the inner rounded corners for the screen to scale down
        c = c.replace('className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col"', 'className="w-full h-full bg-white rounded-3xl sm:rounded-[2.8rem] overflow-hidden relative flex flex-col"')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(c)

def fix_vcard_aspect():
    file_path = 'frontend/src/app/dashboard/vcard/page.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        c = f.read()

    original = 'className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[1/2.11] rounded-[3.5rem] bg-gray-900 p-[10px] sm:p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto border-4 border-gray-800"'
    new = 'className="relative h-[65vh] max-h-[650px] sm:h-auto sm:w-[340px] aspect-[1/2.11] rounded-[2.5rem] sm:rounded-[3.5rem] bg-gray-900 p-[8px] sm:p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto sm:border-4 border-2 border-gray-800"'
    
    if original in c:
        c = c.replace(original, new)
        
        c = c.replace('className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col"', 'className="w-full h-full bg-white rounded-3xl sm:rounded-[2.8rem] overflow-hidden relative flex flex-col"')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(c)

fix_bio_aspect()
fix_vcard_aspect()
print("Fixed height for mockups")
