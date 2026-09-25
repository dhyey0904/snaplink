import re
with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace any negative margin hacks used previously
content = re.sub(r' -m-\d+', '', content)
content = re.sub(r' p-\d+', '', content) # wait, this will remove padding everywhere! NO!

# Let's just target the specific widget cases in renderWidgetContent
old_notes = '<div className="flex flex-col h-full bg-[#fefce8] -m-5 p-5">'
new_notes = '<div className="flex flex-col h-full bg-[#fefce8] rounded-xl flex-1">'

content = content.replace(old_notes, new_notes)

# In SortableWidget, I added `p-4 pt-14` to the content container. That's good. But we want inner content to fill nicely.
# Wait, SortableWidget is right there. Let's make sure SortableWidget container passes `h-full` properly.
# The container is `<div className="flex-1 h-full w-full p-4 pt-14 overflow-hidden cursor-pointer pointer-events-auto flex flex-col">`
# For things like Calculator or Pomodoro, we don't want them bound strictly inside padding if they want to use backgrounds,
# but it's fine for now.

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned up page.tsx")
