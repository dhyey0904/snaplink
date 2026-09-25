with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
imports = '''import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';\n'''

content = content.replace('import { fetchAPI } from "@/utils/api";', imports + 'import { fetchAPI } from "@/utils/api";')
content = content.replace("Pin, Command,", "Pin, Command, GripHorizontal,")

# 2. Add SortableWidget above SnapOS
sortable_component = '''
function SortableWidget({ widget, meta, isMenuOpen, setActiveMenu, updateWidgetSize, togglePin, removeWidget, renderWidgetContent, realData }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const getSizeClasses = (size: WidgetSize) => {
    switch(size) {
      case "small": return "col-span-1 row-span-1";
      case "tall": return "col-span-1 row-span-2";
      case "medium": return "col-span-2 row-span-1";
      case "large": return "col-span-2 row-span-2";
      case "full": return "col-span-2 md:col-span-4 row-span-1";
      default: return "col-span-2 row-span-1";
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`${getSizeClasses(widget.size)} relative group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-visible ${isDragging ? 'opacity-50 ring-2 ring-blue-500 scale-105' : ''}`}
    >
      <div {...attributes} {...listeners} className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-gray-100 border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-50 flex items-center justify-center shadow-sm hover:bg-gray-200">
        <GripHorizontal size={12} className="text-gray-400" />
      </div>
      
      {/* Widget Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.bg} ${meta.color}`}>
            {meta.icon}
          </div>
          {widget.size !== "small" && <h4 className="font-bold text-gray-900 text-sm">{meta.name}</h4>}
        </div>
        
        {/* Context Menu Button (Long Press Simulation) */}
        <button 
          onClick={() => setActiveMenu(isMenuOpen ? null : widget.id)}
          className="pointer-events-auto text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Widget Context Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-4 flex flex-col gap-2 justify-center animate-in fade-in zoom-in-95 duration-100 pointer-events-auto">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">{meta.name} Options</h5>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => updateWidgetSize(widget.id, "small")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Small 1x1</button>
            <button onClick={() => updateWidgetSize(widget.id, "tall")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Tall 1x2</button>
            <button onClick={() => updateWidgetSize(widget.id, "medium")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Med 2x1</button>
            <button onClick={() => updateWidgetSize(widget.id, "large")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Large 2x2</button>
            <button onClick={() => updateWidgetSize(widget.id, "full")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700 col-span-2">Full Width</button>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => togglePin(widget.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1">
              <Pin size={14} /> Pin
            </button>
            <button onClick={() => removeWidget(widget.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1">
              <Trash2 size={14} /> Remove
            </button>
          </div>
          <button onClick={() => setActiveMenu(null)} className="absolute top-2 right-2 text-gray-400 p-1">
             <X size={16} /> 
          </button>
        </div>
      )}

      {/* Content Renderer */}
      <div 
        className="flex-1 h-full overflow-hidden cursor-pointer pointer-events-auto"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) return;
          if (widget.id === 'links') window.location.href = '/dashboard/links';
          if (widget.id === 'files') window.location.href = '/dashboard/files';
          if (widget.id === 'gmail' && realData?.google) window.location.href = 'https://mail.google.com';
          if (widget.id === 'calendar' && realData?.google) window.location.href = 'https://calendar.google.com';
        }}
      >
        {renderWidgetContent(widget.id, widget.size)}
      </div>
    </div>
  );
}

'''
content = content.replace("export default function SnapOS() {", sortable_component + "export default function SnapOS() {")

# 3. Add 'tall' to WidgetSize type
content = content.replace('type WidgetSize = "small" | "medium" | "large" | "full";', 'type WidgetSize = "small" | "medium" | "tall" | "large" | "full";')

# 4. Remove old getSizeClasses
import re
content = re.sub(r'  const getSizeClasses = \(size: WidgetSize\) => \{[\s\S]*?^\s*\};\n', '', content, flags=re.MULTILINE)

# 5. Add DnD hooks
hooks = '''  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newLayout = arrayMove(items, oldIndex, newIndex);
        const updated = newLayout.map((item, index) => ({ ...item, order: index + 1 }));
        localStorage.setItem("snap_os_layout", JSON.stringify(updated));
        return updated;
      });
    }
  };
'''
content = content.replace("  useEffect(() => {", hooks + "\n  useEffect(() => {")

# 6. Replace old rendering with SortableWidget
old_grid_start = '<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">'
new_grid_start = '''<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={gridWidgets.map(w => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[140px] md:auto-rows-[160px] grid-flow-dense pb-20">'''
content = content.replace(old_grid_start, new_grid_start)

# Now we need to strip out the old mapping block
# From: {gridWidgets.map((widget) => {
# To:   })} right before {/* Add Widget Ghost Card */}

old_map = '''            {gridWidgets.map((widget) => {
              const meta = WIDGET_MANIFEST.find(m => m.id === widget.id);
              if (!meta) return null;
              
              const isMenuOpen = activeMenu === widget.id;
              
              return (
                <div key={widget.id} className={`${getSizeClasses(widget.size)} relative group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-visible`}>
                  
                  {/* Widget Header */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.bg} ${meta.color}`}>
                        {meta.icon}
                      </div>
                      {widget.size !== "small" && <h4 className="font-bold text-gray-900 text-sm">{meta.name}</h4>}
                    </div>
                    
                    {/* Context Menu Button (Long Press Simulation) */}
                    <button 
                      onClick={() => setActiveMenu(isMenuOpen ? null : widget.id)}
                      className="pointer-events-auto text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* Widget Context Menu Overlay */}
                  {isMenuOpen && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-4 flex flex-col gap-2 justify-center animate-in fade-in zoom-in-95 duration-100 pointer-events-auto">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">{meta.name} Options</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => updateWidgetSize(widget.id, "small")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Small 1x1</button>
                        <button onClick={() => updateWidgetSize(widget.id, "medium")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Med 2x1</button>
                        <button onClick={() => updateWidgetSize(widget.id, "large")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Large 2x2</button>
                        <button onClick={() => updateWidgetSize(widget.id, "full")} className="bg-gray-50 hover:bg-gray-100 text-xs font-bold py-2 rounded-lg text-gray-700">Full Width</button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => togglePin(widget.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1">
                          <Pin size={14} /> Pin
                        </button>
                        <button onClick={() => removeWidget(widget.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1">
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                      <button onClick={() => setActiveMenu(null)} className="absolute top-2 right-2 text-gray-400 p-1">
                         <X size={16} /> 
                      </button>
                    </div>
                  )}

                  {/* Content Renderer */}
                  <div 
                      className="flex-1 overflow-hidden cursor-pointer pointer-events-auto"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) return;
                        if (widget.id === 'links') window.location.href = '/dashboard/links';
                        if (widget.id === 'files') window.location.href = '/dashboard/files';
                        if (widget.id === 'gmail' && realData?.google) window.location.href = 'https://mail.google.com';
                        if (widget.id === 'calendar' && realData?.google) window.location.href = 'https://calendar.google.com';
                      }}
                    >
                      {renderWidgetContent(widget.id, widget.size)}
                    </div>
                </div>
              );
            })}'''

new_map = '''            {gridWidgets.map((widget) => {
              const meta = WIDGET_MANIFEST.find(m => m.id === widget.id);
              if (!meta) return null;
              const isMenuOpen = activeMenu === widget.id;
              return (
                <SortableWidget key={widget.id} widget={widget} meta={meta} isMenuOpen={isMenuOpen} setActiveMenu={setActiveMenu} updateWidgetSize={updateWidgetSize} togglePin={togglePin} removeWidget={removeWidget} renderWidgetContent={renderWidgetContent} realData={realData} />
              );
            })}'''

content = content.replace(old_map, new_map)
content = content.replace('          {/* Add Widget Ghost Card */}', '          </SortableContext>\n        </DndContext>\n          {/* Add Widget Ghost Card */}')

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("DnD integrated")
