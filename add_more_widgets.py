import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add missing lucide imports
if "Zap, Calculator as CalculatorIcon, Timer" not in content:
    content = content.replace(
        "X, Plus, User, Clock as ClockIcon",
        "X, Plus, User, Clock as ClockIcon, Zap, Calculator as CalculatorIcon, Timer"
    )

# 2. Add Component Imports
if "import PomodoroWidget" not in content:
    content = content.replace('import { fetchAPI } from "@/utils/api";', 'import { fetchAPI } from "@/utils/api";\nimport PomodoroWidget from "@/components/widgets/PomodoroWidget";\nimport CalculatorWidget from "@/components/widgets/CalculatorWidget";\nimport QuickLinkWidget from "@/components/widgets/QuickLinkWidget";')

# 3. Update WIDGET_MANIFEST
old_manifest = '''const WIDGET_MANIFEST = [
  { id: "links", name: "Link Manager", type: "core", size: "medium", icon: <Link2 />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "files", name: "File Manager", type: "core", size: "medium", icon: <FolderOpen />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "gmail", name: "Gmail", type: "integration", size: "medium", icon: <Mail />, color: "text-red-500", bg: "bg-red-50" },
  { id: "calendar", name: "Calendar", type: "integration", size: "medium", icon: <Calendar />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "tasks", name: "Tasks", type: "productivity", size: "medium", icon: <CheckSquare />, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "notes", name: "Scratchpad", type: "productivity", size: "medium", icon: <CheckSquare />, color: "text-yellow-600", bg: "bg-yellow-100" },
  { id: "clock", name: "Clock", type: "personal", size: "small", icon: <ClockIcon />, color: "text-slate-600", bg: "bg-slate-100" },
  { id: "bio", name: "Bio Page", type: "core", size: "medium", icon: <User />, color: "text-fuchsia-600", bg: "bg-fuchsia-100" }
];'''

new_manifest = '''const WIDGET_MANIFEST = [
  { id: "links", name: "Link Manager", type: "core", size: "medium", icon: <Link2 />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "files", name: "File Manager", type: "core", size: "medium", icon: <FolderOpen />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "quicklink", name: "Quick Shorten", type: "core", size: "medium", icon: <Zap />, color: "text-amber-600", bg: "bg-amber-100" },
  { id: "gmail", name: "Gmail", type: "integration", size: "medium", icon: <Mail />, color: "text-red-500", bg: "bg-red-50" },
  { id: "calendar", name: "Calendar", type: "integration", size: "medium", icon: <Calendar />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "tasks", name: "Tasks", type: "productivity", size: "medium", icon: <CheckSquare />, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "notes", name: "Scratchpad", type: "productivity", size: "medium", icon: <CheckSquare />, color: "text-yellow-600", bg: "bg-yellow-100" },
  { id: "pomodoro", name: "Focus Timer", type: "productivity", size: "small", icon: <Timer />, color: "text-rose-600", bg: "bg-rose-100" },
  { id: "calculator", name: "Calculator", type: "productivity", size: "medium", icon: <CalculatorIcon />, color: "text-teal-600", bg: "bg-teal-100" },
  { id: "clock", name: "Clock", type: "personal", size: "small", icon: <ClockIcon />, color: "text-slate-600", bg: "bg-slate-100" },
  { id: "bio", name: "Bio Page", type: "core", size: "medium", icon: <User />, color: "text-fuchsia-600", bg: "bg-fuchsia-100" }
];'''

content = content.replace(old_manifest, new_manifest)


# 4. renderWidgetContent
old_render = '''        case "bio":
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
          );'''

new_render = '''        case "bio":
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
        case "pomodoro":
          return <PomodoroWidget />;
        case "calculator":
          return <CalculatorWidget />;
        case "quicklink":
          return <QuickLinkWidget />;'''

if 'case "pomodoro":' not in content:
    content = content.replace(old_render, new_render)


with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added widgets")
