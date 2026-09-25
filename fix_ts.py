with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
if "X, Plus, User, Clock as ClockIcon" not in content:
    content = content.replace(
        "FolderOpen, Search, MoreHorizontal, Trash2, Pin, Command",
        "FolderOpen, Search, MoreHorizontal, Trash2, Pin, Command, X, Plus, User, Clock as ClockIcon"
    )

# 2. WIDGET_MANIFEST
old_manifest = '''const WIDGET_MANIFEST = [
  { id: "links", name: "Link Manager", icon: <Link2 />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "files", name: "File Manager", icon: <FolderOpen />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "gmail", name: "Gmail", icon: <Mail />, color: "text-red-500", bg: "bg-red-50" },
  { id: "calendar", name: "Calendar", icon: <Calendar />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "tasks", name: "Tasks", icon: <CheckSquare />, color: "text-indigo-500", bg: "bg-indigo-50" },
];'''

new_manifest = '''const WIDGET_MANIFEST = [
  { id: "links", name: "Link Manager", type: "core", size: "medium", icon: <Link2 />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "files", name: "File Manager", type: "core", size: "medium", icon: <FolderOpen />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "gmail", name: "Gmail", type: "integration", size: "medium", icon: <Mail />, color: "text-red-500", bg: "bg-red-50" },
  { id: "calendar", name: "Calendar", type: "integration", size: "medium", icon: <Calendar />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "tasks", name: "Tasks", type: "productivity", size: "medium", icon: <CheckSquare />, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "notes", name: "Scratchpad", type: "productivity", size: "medium", icon: <CheckSquare />, color: "text-yellow-600", bg: "bg-yellow-100" },
  { id: "clock", name: "Clock", type: "personal", size: "small", icon: <ClockIcon />, color: "text-slate-600", bg: "bg-slate-100" },
  { id: "bio", name: "Bio Page", type: "core", size: "medium", icon: <User />, color: "text-fuchsia-600", bg: "bg-fuchsia-100" }
];'''

content = content.replace(old_manifest, new_manifest)

# 3. addWidget and removeWidget
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

  const updateWidgetSize = (id: string, newSize: WidgetSize) => {'''

if "const addWidget" not in content:
    content = content.replace("  const updateWidgetSize = (id: string, newSize: WidgetSize) => {", funcs)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed missing things")
