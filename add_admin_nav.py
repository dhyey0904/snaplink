import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

feedback_item = "{ name: 'Feedback', href: '/admin/ratings', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },"

c = c.replace("{ name: 'Settings', href: '/admin/settings'", feedback_item + "\n    { name: 'Settings', href: '/admin/settings'")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added Feedback menu item to admin sidebar")
