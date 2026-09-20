import re

with open('e:/snaplink/frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make the hamburger hidden on sm and above (but sometimes block is needed explicitly)
text = text.replace('className="sm:hidden text-gray-500 hover:text-gray-700 p-2 focus:outline-none"', 'className="block sm:hidden md:hidden lg:hidden text-gray-500 hover:text-gray-700 p-2 focus:outline-none"')
text = text.replace('className="sm:hidden border-t border-gray-100 bg-white"', 'className="block sm:hidden md:hidden lg:hidden border-t border-gray-100 bg-white"')

# For the desktop links wrapper, ensure it's hidden on mobile and flex on sm/md
text = text.replace('className="hidden sm:flex items-center gap-4', 'className="hidden sm:flex md:flex items-center gap-4')

with open('e:/snaplink/frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Navbar updated to hide hamburger on desktop!")
