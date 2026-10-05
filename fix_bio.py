import re

file_path = 'frontend/src/app/dashboard/bio/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_mockup = 'className="relative h-[65vh] max-h-[650px] sm:h-auto sm:w-[340px] aspect-[1/2.11] rounded-[2.5rem] sm:rounded-[3.5rem] bg-black p-[8px] sm:p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto"'
new_mockup = 'className="relative w-[90%] max-w-[320px] sm:max-w-[340px] aspect-[1/2.11] rounded-[2.5rem] sm:rounded-[3.5rem] bg-black p-[8px] sm:p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto"'
content = content.replace(old_mockup, new_mockup)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed bio mockup")
