import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
if "@dnd-kit/core" not in content:
    imports_to_add = '''import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';\n'''
    content = content.replace('import { fetchAPI } from "@/utils/api";', imports_to_add + 'import { fetchAPI } from "@/utils/api";')
    content = content.replace('import { GripHorizontal } from "lucide-react";\n', '')
    content = content.replace('import { GripHorizontal } from "lucide-react";', '')
    if "GripHorizontal" not in content:
        content = content.replace("Pin, Command,", "Pin, Command, GripHorizontal,")

# 2. Add "tall" to WidgetSize
content = content.replace('type WidgetSize = "small" | "medium" | "large" | "full";', 'type WidgetSize = "small" | "medium" | "tall" | "large" | "full";')
content = content.replace('case "small": return "col-span-1 row-span-1";', 'case "small": return "col-span-1 row-span-1";\n      case "tall": return "col-span-1 row-span-2";')

# 3. Add SortableWidget Component above SnapOS
sortable_component = '''
function SortableWidget({ widget, meta, children }: any) {
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
      className={`${getSizeClasses(widget.size)} relative group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-visible ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : ''}`}
    >
      <div {...attributes} {...listeners} className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-white border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-50 flex items-center justify-center shadow-sm">
        <GripHorizontal size={12} className="text-gray-400" />
      </div>
      {children}
    </div>
  );
}

'''
if "function SortableWidget" not in content:
    content = content.replace("export default function SnapOS() {", sortable_component + "export default function SnapOS() {")

# 4. Remove old getSizeClasses from inside SnapOS
pattern_get_size = r'''  const getSizeClasses = \(size: WidgetSize\) => \{[\s\S]*?^\s*\};\n'''
content = re.sub(pattern_get_size, "", content, flags=re.MULTILINE)

# 5. Add DnD hooks to SnapOS
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
if "const handleDragEnd" not in content:
    content = content.replace("  useEffect(() => {", hooks + "\n  useEffect(() => {")

# 6. Wrap grid in DndContext and SortableContext
old_grid = r'''<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-\[140px\] md:auto-rows-\[160px\] grid-flow-dense">
            \{gridWidgets\.map\(\(widget\) => \{
              const meta = WIDGET_MANIFEST\.find\(m => m\.id === widget\.id\);
              if \(!meta\) return null;
              
              return \(
                <div key=\{widget\.id\} className={`\$\{getSizeClasses\(widget\.size\)\} relative group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-visible`}>'''

new_grid = '''<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={gridWidgets.map(w => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px] grid-flow-dense pb-20">
              {gridWidgets.map((widget) => {
                const meta = WIDGET_MANIFEST.find(m => m.id === widget.id);
                if (!meta) return null;
                
                return (
                  <SortableWidget key={widget.id} widget={widget} meta={meta}>'''

# Wait, the exact string match might fail if grid-flow-dense is not there. Let's do a more robust replace using string index logic.
start_grid_idx = content.find('<div className="grid grid-cols-2')
end_grid_idx = content.find(' {/* Add Widget Ghost Card */}')
if start_grid_idx != -1 and end_grid_idx != -1:
    old_grid_block = content[start_grid_idx:end_grid_idx]
    
    # We need to replace the outermost div of the widget with SortableWidget
    new_grid_block = old_grid_block.replace(
        '<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">',
        '<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>\n          <SortableContext items={gridWidgets.map(w => w.id)} strategy={rectSortingStrategy}>\n            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px] grid-flow-dense pb-20">'
    )
    
    # Regex to replace the widget div
    # <div key={widget.id} className={`${getSizeClasses(widget.size)} relative group ... `}>
    pattern_widget_div = r'<div key=\{widget\.id\} className=\{`\$\{getSizeClasses\(widget\.size\)\}.*?`\}>'
    new_grid_block = re.sub(pattern_widget_div, '<SortableWidget key={widget.id} widget={widget} meta={meta}>', new_grid_block)
    
    # We need to find the matching closing div for each widget and replace with </SortableWidget>
    # Since we are just replacing the tag, it's easier to just replace the whole block manually if regex fails.
    
    # Let's use a simpler approach:
    new_grid_block = new_grid_block.replace('</div>\n              );\n            })}Title="Widget context"', '</SortableWidget>\n              );\n            }')
    # Wait, the closing tag is after the `renderWidgetContent`
    
    # Let's do a manual string replace of the exact block we know
    pass

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Partial done")
