with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_add = '''  const addWidget = (id: string) => {
    if (!layout.find(w => w.id === id)) {
      saveLayout([...layout, { id, size: "medium", pinned: false, order: layout.length + 1 }]);
    }
  };'''

new_add = '''  const addWidget = (id: string) => {
    if (layout.find(w => w.id === id)) return;
    const meta = WIDGET_MANIFEST.find(m => m.id === id);
    if (!meta) return;
    const newLayout = [...layout, { id, size: meta.size as WidgetSize, pinned: false, order: layout.length + 1 }];
    setLayout(newLayout);
    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));
    setShowMarketplace(false);
  };'''

old_remove = '''  const removeWidget = (id: string) => {
    saveLayout(layout.filter(w => w.id !== id));
    setActiveMenu(null);
  };'''

new_remove = '''  const removeWidget = (id: string, e?: any) => {
    if (e) e.stopPropagation();
    const newLayout = layout.filter(w => w.id !== id);
    setLayout(newLayout);
    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));
    setActiveMenu(null);
  };'''

# If old exists, replace it with new, and then delete the other new
if old_add in content:
    content = content.replace(old_add, "")
if new_add in content:
    content = content.replace(new_add, old_add) # just to reset state temporarily
    content = content.replace(old_add, new_add) # put the new one back in

# Wait, the easiest way is to just erase both completely, and insert them at a known hook.
content = content.replace(old_add, "")
content = content.replace(new_add, "")
content = content.replace(old_remove, "")
content = content.replace(new_remove, "")

# Remove the one with e: any
alt_remove = '''  const removeWidget = (id: string, e: any) => {
    e.stopPropagation();
    const newLayout = layout.filter(w => w.id !== id);
    setLayout(newLayout);
    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));
  };'''
content = content.replace(alt_remove, "")

hook = "  const updateWidgetSize = (id: string, newSize: WidgetSize) => {"
injection = new_add + "\n\n" + new_remove + "\n\n" + hook

content = content.replace(hook, injection)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned up completely")
