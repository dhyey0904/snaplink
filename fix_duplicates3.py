import re
with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern1 = r'''  const sensors = useSensors\(
    useSensor\(PointerSensor, \{ activationConstraint: \{ distance: 5 \} \}\),
    useSensor\(KeyboardSensor, \{ coordinateGetter: sortableKeyboardCoordinates \}\)
  \);\n
  const handleDragEnd = \(event: DragEndEvent\) => \{
    const \{ active, over \} = event;
    if \(over && active\.id !== over\.id\) \{
      setLayout\(\(items\) => \{
        const oldIndex = items\.findIndex\(\(i\) => i\.id === active\.id\);
        const newIndex = items\.findIndex\(\(i\) => i\.id === over\.id\);
        const newLayout = arrayMove\(items, oldIndex, newIndex\);
        const updated = newLayout\.map\(\(item, index\) => \(\{ \.\.\.item, order: index \+ 1 \}\)\);
        localStorage\.setItem\("snap_os_layout", JSON\.stringify\(updated\)\);
        return updated;
      \}\);
    \}
  \};\n+'''

content = re.sub(pattern1, "", content, count=1)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Removed duplicates")
