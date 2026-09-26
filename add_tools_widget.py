import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Wrench to Lucide imports
content = content.replace("Zap, Calculator as CalculatorIcon, Clock as ClockIcon", "Zap, Calculator as CalculatorIcon, Clock as ClockIcon, Wrench")

# 2. Add 'tools' to WIDGET_MANIFEST
manifest_str = '{ id: "bio", name: "Bio Page", type: "core", size: "medium", icon: <User />, color: "text-fuchsia-600", bg: "bg-fuchsia-100" }'
manifest_replacement = manifest_str + ',\n    { id: "tools", name: "Snap Tools", type: "core", size: "medium", icon: <Wrench />, color: "text-red-500", bg: "bg-red-50" }'
content = content.replace(manifest_str, manifest_replacement)

# 3. Add 'case "tools":' to renderWidgetContent
case_str = 'case "bio":'
case_replacement = '''case "tools":
          return (
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-xs font-bold text-red-500 mb-1 tracking-wider uppercase">PDF Utilities</p>
                <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">7+ Free Tools</h4>
              </div>
              {size !== "small" && (
                <a href="/tools" className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                  Open Snap Tools
                </a>
              )}
            </div>
          );
        case "bio":'''
content = content.replace(case_str, case_replacement)

# 4. Also make sure the onClick on the widget wrapper navigates to /tools
click_handler_str = "if (widget.id === 'bio') window.location.href = '/dashboard/bio';"
click_replacement = click_handler_str + "\n            if (widget.id === 'tools') window.location.href = '/tools';"
content = content.replace(click_handler_str, click_replacement)


with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added Snap Tools widget to OS")
