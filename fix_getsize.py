import re
with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

get_size_fn = '''  const getSizeClasses = (size: WidgetSize) => {
    switch(size) {
      case "small": return "col-span-1 row-span-1";
      case "tall": return "col-span-1 row-span-2";
      case "medium": return "col-span-2 row-span-1";
      case "large": return "col-span-2 row-span-2";
      case "full": return "col-span-2 md:col-span-4 row-span-1";
      default: return "col-span-2 row-span-1";
    }
  };\n\n  return ('''

content = content.replace("  return (", get_size_fn, 1) # Only replace the first `return (` which is in SortableWidget

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
