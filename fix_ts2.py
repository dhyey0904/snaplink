with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

funcs = '''  const addWidget = (id: string) => {
    if (layout.find(w => w.id === id)) return;
    const meta = WIDGET_MANIFEST.find(m => m.id === id);
    if (!meta) return;
    const newLayout = [...layout, { id, size: meta.size as WidgetSize, pinned: false, order: layout.length + 1 }];
    setLayout(newLayout);
    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));
    setShowMarketplace(false);
  };

  const removeWidget = (id: string, e?: any) => {
    if (e) e.stopPropagation();
    const newLayout = layout.filter(w => w.id !== id);
    setLayout(newLayout);
    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));
    setActiveMenu(null);
  };

  const updateWidgetSize = (id: string, size: WidgetSize) => {'''

if "const addWidget" not in content:
    content = content.replace("  const updateWidgetSize = (id: string, size: WidgetSize) => {", funcs)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed missing things part 2")
