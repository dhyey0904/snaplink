import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix SortableWidget container
content = content.replace(
    'className="flex-1 h-full w-full pt-14 overflow-hidden cursor-pointer pointer-events-auto flex flex-col"',
    'className="flex-1 h-full w-full px-5 pb-5 pt-14 overflow-hidden cursor-pointer pointer-events-auto flex flex-col"'
)

# Fix Menu Overlay padding
content = content.replace(
    'className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col gap-2 justify-center \nanimate-in fade-in zoom-in-95 duration-100 pointer-events-auto"',
    'className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-4 flex flex-col gap-2 justify-center animate-in fade-in zoom-in-95 duration-100 pointer-events-auto"'
)
# sometimes newline is different
content = content.replace(
    'className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col gap-2 justify-center animate-in fade-in zoom-in-95 duration-100 pointer-events-auto"',
    'className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-4 flex flex-col gap-2 justify-center animate-in fade-in zoom-in-95 duration-100 pointer-events-auto"'
)

# Fix Avatar padding
content = content.replace(
    'className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600"',
    'className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5"'
)

# Fix Bottom Dock padding
content = content.replace(
    'className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl flex justify-around items-center z-50"',
    'className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-3 flex justify-around items-center z-50"'
)

# Fix Buttons in dock padding
content = content.replace(
    'className="text-blue-600 bg-blue-50 rounded-2xl"',
    'className="text-blue-600 bg-blue-50 p-3 rounded-2xl"'
)
content = content.replace(
    'className="text-gray-400 hover:text-gray-800 transition-colors"',
    'className="text-gray-400 hover:text-gray-800 transition-colors p-3"'
)


with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Restored missing padding classes")
