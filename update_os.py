import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Imports
if "import { Plus, X, Trash, Clock as ClockIcon, User" not in content:
    content = content.replace('import { Mail, Calendar', 'import { Mail, Calendar, Plus, X, Trash, Clock as ClockIcon, User, Timer')

# 2. Update WIDGET_MANIFEST
pattern_manifest = r'''const WIDGET_MANIFEST: WidgetMeta\[\] = \[.*?\];'''
new_manifest = '''const WIDGET_MANIFEST: WidgetMeta[] = [
  { id: "links", name: "SnapLinks", type: "core", size: "medium", icon: <Link2 size={18}/>, bg: "bg-blue-100", color: "text-blue-600" },
  { id: "files", name: "Secure Files", type: "core", size: "medium", icon: <HardDrive size={18}/>, bg: "bg-emerald-100", color: "text-emerald-600" },
  { id: "gmail", name: "Gmail", type: "integration", size: "full", icon: <Mail size={18}/>, bg: "bg-red-100", color: "text-red-600" },
  { id: "calendar", name: "Calendar", type: "integration", size: "medium", icon: <Calendar size={18}/>, bg: "bg-blue-100", color: "text-blue-600" },
  { id: "tasks", name: "Tasks", type: "productivity", size: "medium", icon: <CheckSquare size={18}/>, bg: "bg-indigo-100", color: "text-indigo-600" },
  { id: "notes", name: "Scratchpad", type: "productivity", size: "medium", icon: <FileText size={18}/>, bg: "bg-yellow-100", color: "text-yellow-600" },
  { id: "clock", name: "Clock", type: "personal", size: "small", icon: <ClockIcon size={18}/>, bg: "bg-slate-100", color: "text-slate-600" },
  { id: "bio", name: "Bio Page", type: "core", size: "medium", icon: <User size={18}/>, bg: "bg-fuchsia-100", color: "text-fuchsia-600" }
];'''
content = re.sub(pattern_manifest, new_manifest, content, flags=re.DOTALL)

# 3. Add Marketplace State & Notes State
if "showMarketplace" not in content:
    content = content.replace('const [tasks, setTasks] = useState', 'const [showMarketplace, setShowMarketplace] = useState(false);\n  const [notes, setNotes] = useState("");\n  const [time, setTime] = useState(new Date());\n\n  useEffect(() => {\n    const timer = setInterval(() => setTime(new Date()), 1000);\n    const savedNotes = localStorage.getItem("snap_notes");\n    if (savedNotes) setNotes(savedNotes);\n    return () => clearInterval(timer);\n  }, []);\n\n  const handleNoteChange = (e: any) => {\n    setNotes(e.target.value);\n    localStorage.setItem("snap_notes", e.target.value);\n  };\n\n  const addWidget = (id: string) => {\n    if (layout.find(w => w.id === id)) return;\n    const meta = WIDGET_MANIFEST.find(m => m.id === id);\n    if (!meta) return;\n    const newLayout = [...layout, { id, size: meta.size as WidgetSize, pinned: false, order: layout.length + 1 }];\n    setLayout(newLayout);\n    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));\n    setShowMarketplace(false);\n  };\n\n  const removeWidget = (id: string, e: any) => {\n    e.stopPropagation();\n    const newLayout = layout.filter(w => w.id !== id);\n    setLayout(newLayout);\n    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));\n  };\n\n  const [tasks, setTasks] = useState')

# 4. Add render logic for new widgets
pattern_render = r'''(case "tasks":\n.*?)(?=default:)'''
new_render_logic = r'''\1
        case "notes":
          return (
            <div className="flex flex-col h-full bg-[#fefce8] -m-5 p-5">
              <textarea 
                value={notes} 
                onChange={handleNoteChange} 
                placeholder="Jot something down..." 
                className="w-full h-full bg-transparent resize-none outline-none text-sm text-yellow-900 placeholder-yellow-600/50"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          );
        case "clock":
          return (
            <div className="flex flex-col h-full items-center justify-center">
              <div className="text-3xl font-light text-slate-800 tracking-tight">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{time.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'})}</div>
            </div>
          );
        case "bio":
          return (
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-xs font-bold text-fuchsia-600 mb-1 tracking-wider uppercase">Link-in-Bio</p>
                <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">Your Public Profile</h4>
              </div>
              <a href="/dashboard/bio" onClick={(e) => e.stopPropagation()} className="mt-4 w-full bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                Edit Bio Page
              </a>
            </div>
          );
'''
content = re.sub(pattern_render, new_render_logic, content, flags=re.DOTALL)

# 5. Fix Context Menu to show Remove Button
pattern_context = r'''<button \n\s*className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-50">\n\s*<MoreHorizontal size=\{16\}/>\n\s*</button>'''
replacement_context = '''<button 
                      onClick={(e) => removeWidget(widget.id, e)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100"
                      title="Remove Widget"
                    >
                      <X size={16}/>
                    </button>'''
content = re.sub(pattern_context, replacement_context, content)

# Also try another variant if regex fails
content = content.replace('<button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-50">\n                      <MoreHorizontal size={16}/>\n                    </button>', replacement_context)

# 6. Change "Add Widget" button to open marketplace
pattern_add_ghost = r'''<button className="col-span-1 min-h-\[140px\] md:min-h-\[160px\] row-span-1 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all group">'''
replacement_add_ghost = '''<button onClick={() => setShowMarketplace(true)} className="col-span-1 min-h-[140px] md:min-h-[160px] row-span-1 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all group">'''
content = re.sub(pattern_add_ghost, replacement_add_ghost, content)

content = content.replace('<button className="col-span-1 row-span-1 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all group">', '<button onClick={() => setShowMarketplace(true)} className="col-span-1 min-h-[140px] md:min-h-[160px] row-span-1 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all group">')


# 7. Inject Marketplace Modal at the bottom
marketplace_modal = '''
      {/* Widget Marketplace Modal */}
      {showMarketplace && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Widget Marketplace</h2>
                <p className="text-sm text-gray-500 mt-1">Customize your Snap OS workspace</p>
              </div>
              <button onClick={() => setShowMarketplace(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WIDGET_MANIFEST.map(meta => {
                  const isAdded = layout.find(w => w.id === meta.id);
                  return (
                    <div key={meta.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isAdded ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'}`} onClick={() => !isAdded && addWidget(meta.id)}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${meta.bg} ${meta.color}`}>
                          {meta.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{meta.name}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{meta.type}</span>
                        </div>
                      </div>
                      {isAdded ? (
                        <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-100 rounded-full">Added</span>
                      ) : (
                        <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
'''

content = content.replace("</div>\n  );\n}", marketplace_modal + "\n      </div>\n    </div>\n  );\n}")
content = content.replace("</div>\n    </div>\n  );\n}", marketplace_modal + "\n      </div>\n    </div>\n  );\n}")

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
