import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix static grid widget wrapper
old_static_wrapper = 'className={`bg-white rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden \ntransition-all duration-300 hover:shadow-md ${getSizeClass(widget.size)} flex flex-col`}'
new_static_wrapper = 'className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative group overflow-hidden transition-all duration-300 hover:shadow-md ${getSizeClass(widget.size)} flex flex-col`}'

# Normalize newlines for the replacement
content = re.sub(
    r'className=\{`bg-white rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden\s*transition-all duration-300 hover:shadow-md \$\{getSizeClass\(widget\.size\)\} flex flex-col`\}',
    new_static_wrapper,
    content
)

# Fix static context menu padding
content = re.sub(
    r'className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col gap-2 \s*justify-center animate-in fade-in zoom-in-95 duration-100"',
    'className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-4 flex flex-col gap-2 justify-center animate-in fade-in zoom-in-95 duration-100"',
    content
)

# Restore Calculator padding inside CalculatorWidget if we had removed it!
# Wait, CalculatorWidget wasn't touched by my `p-` regex because I only ran it on page.tsx!
# Same for Scratchpad (it WAS touched by fix_notes.py which replaced its container in page.tsx).
# Let's fix Scratchpad in page.tsx:
# Right now it's:
# <div className="flex flex-col h-full bg-[#fefce8]">
# But if it's inside `p-5`, it doesn't need negative margins unless we want it edge-to-edge.
# Let's make Scratchpad transparent and just give it yellow text, or let it have a yellow background that fits inside the white card.
# The user's screenshot shows it with a white border. Let's make the wrapper `bg-white` but for Notes, make the wrapper `bg-[#fefce8]`.
# We can do this dynamically:
dynamic_wrapper = 'className={`rounded-3xl p-5 border shadow-sm relative group overflow-hidden transition-all duration-300 hover:shadow-md ${getSizeClass(widget.size)} flex flex-col ${widget.id === "notes" ? "bg-[#fefce8] border-yellow-200" : "bg-white border-gray-100"}`}'

content = content.replace(new_static_wrapper, dynamic_wrapper)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Restored static grid padding and dynamic background")
