import re

file_path = 'frontend/src/app/dashboard/vcard/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the mockup sizing logic to be strictly width-based with a max-width, ensuring it never overflows horizontally on tall narrow screens
old_mockup = 'className="relative h-[65vh] max-h-[650px] sm:h-auto sm:w-[340px] aspect-[1/2.11] rounded-[2.5rem] sm:rounded-[3.5rem] bg-gray-900 p-[8px] sm:p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto sm:border-4 border-2 border-gray-800"'
new_mockup = 'className="relative w-[90%] max-w-[320px] sm:max-w-[340px] aspect-[1/2.11] rounded-[2.5rem] sm:rounded-[3.5rem] bg-gray-900 p-[8px] sm:p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto sm:border-4 border-2 border-gray-800"'
content = content.replace(old_mockup, new_mockup)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed vcard mockup")
