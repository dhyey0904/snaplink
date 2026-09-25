with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

# find where "OS Bottom Dock (Mobile Only)" is
idx = -1
for i, line in enumerate(lines):
    if "OS Bottom Dock (Mobile Only)" in line:
        idx = i
        break

if idx != -1:
    # keep up to the bottom dock end
    # the bottom dock is a div with 4 buttons
    end_dock_idx = idx + 7
    lines = lines[:end_dock_idx]
    
    # Now append the marketplace modal once
    modal = '''
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
    </div>
  );
}
'''
    with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
        f.writelines(lines)
        f.write(modal)
    print("Fixed")
