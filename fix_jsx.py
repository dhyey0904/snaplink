with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the broken tags
content = content.replace("          </SortableContext>\n        </DndContext>\n          {/* Add Widget Ghost Card */}", "          {/* Add Widget Ghost Card */}")

# Add them after the grid's closing div
old_end = '''          </button>
        </div>

      </main>'''

new_end = '''          </button>
        </div>
        </SortableContext>
      </DndContext>

      </main>'''

content = content.replace(old_end, new_end)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed JSX nesting")
