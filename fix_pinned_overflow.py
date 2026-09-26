import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the Pinned Widget wrapper class
old_wrapper = 'className="snap-start shrink-0 w-64 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors relative group shadow-sm"'
new_wrapper = 'className="snap-start shrink-0 w-64 bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors relative group shadow-sm overflow-hidden h-[160px] flex flex-col"'

content = content.replace(old_wrapper, new_wrapper)

# Remove the strict h-16 wrapper around the content
old_compact = '''{/* Compact renderer for horizontal feed */}
                      <div className="h-16">
                        {renderWidgetContent(widget.id, "small")}
                      </div>'''
new_compact = '''{/* Compact renderer for horizontal feed */}
                      <div className="flex-1 overflow-hidden">
                        {renderWidgetContent(widget.id, "small")}
                      </div>'''

content = content.replace(old_compact, new_compact)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Pinned Widget Layout")
