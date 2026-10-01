import re
import os

def scale_mockup_vcard():
    file_path = 'frontend/src/app/dashboard/vcard/page.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        c = f.read()

    # Find the iPhone Frame container
    original = 'className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-gray-900 p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto border-4 border-gray-800"'
    new = 'className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-gray-900 p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto border-4 border-gray-800 transform scale-90 sm:scale-100 origin-top"'
    
    if original in c:
        c = c.replace(original, new)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(c)
    else:
        print("Could not find original string in vcard")

def scale_mockup_bio():
    file_path = 'frontend/src/app/dashboard/bio/page.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        c = f.read()

    original = 'className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-black p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto"'
    new = 'className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-black p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto transform scale-90 sm:scale-100 origin-top"'
    
    if original in c:
        c = c.replace(original, new)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(c)
    else:
        print("Could not find original string in bio")

scale_mockup_vcard()
scale_mockup_bio()
print("Applied scale transform to mockups")
