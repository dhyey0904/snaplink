"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  Mail, Calendar, Github, Linkedin, HardDrive, BarChart3, CreditCard,
  CheckSquare, FileText, Bell, Globe, Search, Bot, QrCode, Link2,
  FolderOpen, Activity, Server, Command, MoreHorizontal, Maximize2, Trash2, Pin
} from "lucide-react";

type WidgetSize = "small" | "medium" | "large" | "full";

interface WidgetConfig {
  id: string;
  size: WidgetSize;
  pinned: boolean;
  order: number;
}

// Master list of all possible OS Widgets
const WIDGET_MANIFEST = [
  { id: "gmail", name: "Gmail", icon: <Mail />, color: "text-red-500", bg: "bg-red-50" },
  { id: "calendar", name: "Calendar", icon: <Calendar />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "github", name: "GitHub", icon: <Github />, color: "text-gray-800", bg: "bg-gray-100" },
  { id: "linkedin", name: "LinkedIn", icon: <Linkedin />, color: "text-blue-700", bg: "bg-blue-50" },
  { id: "drive", name: "Google Drive", icon: <HardDrive />, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "website", name: "Website Health", icon: <Globe />, color: "text-teal-500", bg: "bg-teal-50" },
  { id: "analytics", name: "Analytics", icon: <BarChart3 />, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "revenue", name: "Finance", icon: <CreditCard />, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "tasks", name: "Tasks", icon: <CheckSquare />, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "notes", name: "Notes", icon: <FileText />, color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "notifications", name: "Alerts", icon: <Bell />, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "seo", name: "SEO", icon: <Search />, color: "text-cyan-500", bg: "bg-cyan-50" },
  { id: "assistant", name: "AI Assistant", icon: <Bot />, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "qr", name: "QR Codes", icon: <QrCode />, color: "text-slate-700", bg: "bg-slate-100" },
  { id: "links", name: "Link Manager", icon: <Link2 />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "files", name: "File Manager", icon: <FolderOpen />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "server", name: "Server", icon: <Server />, color: "text-gray-600", bg: "bg-gray-100" },
  { id: "quick", name: "Quick Actions", icon: <Command />, color: "text-pink-500", bg: "bg-pink-50" }
];

const DEFAULT_LAYOUT: WidgetConfig[] = [
  { id: "gmail", size: "medium", pinned: false, order: 1 },
  { id: "github", size: "medium", pinned: false, order: 2 },
  { id: "calendar", size: "medium", pinned: true, order: 3 },
  { id: "revenue", size: "small", pinned: false, order: 4 },
  { id: "website", size: "small", pinned: false, order: 5 },
  { id: "drive", size: "large", pinned: false, order: 6 },
  { id: "tasks", size: "medium", pinned: true, order: 7 }
];

export default function SnapOS() {
  const [layout, setLayout] = useState<WidgetConfig[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("snap_os_layout");
    if (saved) {
      setLayout(JSON.parse(saved));
    } else {
      setLayout(DEFAULT_LAYOUT);
    }
    setIsLoaded(true);
  }, []);

  const saveLayout = (newLayout: WidgetConfig[]) => {
    setLayout(newLayout);
    localStorage.setItem("snap_os_layout", JSON.stringify(newLayout));
  };

  const updateWidgetSize = (id: string, size: WidgetSize) => {
    saveLayout(layout.map(w => w.id === id ? { ...w, size } : w));
    setActiveMenu(null);
  };

  const togglePin = (id: string) => {
    saveLayout(layout.map(w => w.id === id ? { ...w, pinned: !w.pinned } : w));
    setActiveMenu(null);
  };

  const removeWidget = (id: string) => {
    saveLayout(layout.filter(w => w.id !== id));
    setActiveMenu(null);
  };

  const addWidget = (id: string) => {
    if (!layout.find(w => w.id === id)) {
      saveLayout([...layout, { id, size: "medium", pinned: false, order: layout.length + 1 }]);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-black"></div>;

  const pinnedWidgets = layout.filter(w => w.pinned);
  const gridWidgets = layout.filter(w => !w.pinned).sort((a, b) => a.order - b.order);

  // Widget Renderer Engine
  const renderWidgetContent = (id: string, size: WidgetSize) => {
    switch (id) {
      case "gmail":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-red-500 mb-1 tracking-wider uppercase">Action Required</p>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">3 client emails require a reply.</h4>
              {size === "large" || size === "full" ? (
                <div className="space-y-2 mt-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-700 flex justify-between">
                    <span className="font-medium truncate mr-2">Invoice #8843 from AWS</span>
                    <span className="text-gray-400">10m</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-700 flex justify-between">
                    <span className="font-medium truncate mr-2">Project Brief - Design Flow</span>
                    <span className="text-gray-400">1h</span>
                  </div>
                </div>
              ) : null}
            </div>
            {size !== "small" && (
              <button className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-bold transition-colors">
                Reply to ABC Company
              </button>
            )}
          </div>
        );
      case "github":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <p className="text-xs font-bold text-gray-600 tracking-wider uppercase">Deployment Failed</p>
              </div>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight">2 pull requests are waiting.</h4>
            </div>
            {size !== "small" && (
              <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-xl text-xs font-bold transition-colors">
                Review PR #54
              </button>
            )}
          </div>
        );
      case "calendar":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-blue-500 mb-1 tracking-wider uppercase">In 45 Minutes</p>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight">Client Sync: Q4 Roadmap</h4>
              {size === "large" || size === "full" ? (
                <p className="text-xs text-gray-500 mt-2">Followed by "Team Standup" at 11:30 AM.</p>
              ) : null}
            </div>
            {size !== "small" && (
              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
                Join Google Meet
              </button>
            )}
          </div>
        );
      case "revenue":
        return (
          <div className="flex flex-col h-full justify-center">
            <p className="text-xs font-bold text-purple-500 mb-1 tracking-wider uppercase">Today's Revenue</p>
            <h4 className="text-2xl font-black text-gray-900">₹12,500</h4>
            {size !== "small" && (
              <div className="mt-2 text-xs font-bold text-green-500 flex items-center gap-1 bg-green-50 w-max px-2 py-1 rounded-md">
                <Activity size={12} /> +14.5% vs yesterday
              </div>
            )}
          </div>
        );
      case "drive":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Storage</p>
                <span className="text-xs font-bold text-gray-500">82%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-emerald-500 w-[82%]"></div>
              </div>
              <h4 className="text-gray-900 font-bold text-sm leading-tight">Running out of space in Workspace Drive.</h4>
            </div>
            {size !== "small" && (
              <button className="mt-4 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl text-xs font-bold transition-colors">
                Clean up large files
              </button>
            )}
          </div>
        );
      case "website":
      case "analytics":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-orange-500 mb-1 tracking-wider uppercase">Traffic Alert</p>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight">Traffic increased by 24%.</h4>
              {(size === "large" || size === "full") && (
                <p className="text-xs text-gray-500 mt-2">However, /pricing page load time dropped to 4.2s.</p>
              )}
            </div>
            {size !== "small" && (
              <button className="mt-4 w-full bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 rounded-xl text-xs font-bold transition-colors">
                Optimize /pricing
              </button>
            )}
          </div>
        );
      case "tasks":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-500 mb-1 tracking-wider uppercase">Tasks (7 Pending)</p>
              <ul className="space-y-2 mt-2">
                <li className="flex items-center gap-2 text-sm font-medium text-gray-700 line-through opacity-50"><CheckSquare size={14}/> Morning review</li>
                <li className="flex items-center gap-2 text-sm font-bold text-gray-900"><div className="w-3.5 h-3.5 border-2 border-gray-300 rounded-sm"></div> Publish LinkedIn Post</li>
                {size === "large" && <li className="flex items-center gap-2 text-sm font-bold text-gray-900"><div className="w-3.5 h-3.5 border-2 border-gray-300 rounded-sm"></div> Renew domain name</li>}
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col h-full justify-center items-center text-center opacity-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Connected</span>
            <p className="text-sm font-medium text-gray-600">Syncing live data...</p>
          </div>
        );
    }
  };

  // Convert logical size to Tailwind CSS grid classes
  const getSizeClass = (size: WidgetSize) => {
    switch(size) {
      case "small": return "col-span-1 row-span-1";
      case "medium": return "col-span-2 row-span-1";
      case "large": return "col-span-2 row-span-2";
      case "full": return "col-span-2 md:col-span-4 row-span-1";
      default: return "col-span-2 row-span-1";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] font-sans selection:bg-blue-500/30">
      
      {/* OS Status Bar (Hidden Desktop, visible mobile) */}
      <div className="md:hidden flex justify-between items-center px-6 pt-4 pb-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
        <span>Snap OS v1.0</span>
        <span>Secure</span>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 w-full py-4 md:py-12 relative z-20 mb-20 overflow-x-hidden">
        
        {/* 1. Greeting Card */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5">
              <div className="w-full h-full bg-[#09090B] rounded-full border-2 border-[#09090B] overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Dhyey" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{greeting}, Dhyey</h1>
              <p className="text-xs text-gray-400 mt-0.5 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Everything is running smoothly.
              </p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* 2. AI Daily Summary Card */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-6 shadow-2xl mb-8 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/10 text-blue-400">
              <Bot size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                AI Summary <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md text-[9px]">LIVE</span>
              </h3>
              
              <div className="space-y-3 text-sm md:text-base text-gray-300 font-medium leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="text-green-400 shrink-0 mt-1"><CheckSquare size={16}/></span>
                  <span>You slept 7h. Today you have <strong className="text-white">2 Meetings</strong> and <strong className="text-white">3 Important Emails</strong> waiting.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-400 shrink-0 mt-1"><CheckSquare size={16}/></span>
                  <span><strong className="text-white">₹12,500 Revenue</strong> collected yesterday. GitHub deployment <strong className="text-red-400">failed</strong>.</span>
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/50">
                  Reply to Client
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/5">
                  Merge PR #54
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Pinned Widgets (Horizontal Carousel) */}
        {pinnedWidgets.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <Pin size={12} /> Pinned Favorites
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
              {pinnedWidgets.map(widget => {
                const meta = WIDGET_MANIFEST.find(m => m.id === widget.id)!;
                return (
                  <div key={`pin-${widget.id}`} className="snap-start shrink-0 w-64 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors relative group">
                    <button 
                      onClick={() => togglePin(widget.id)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pin size={14} className="fill-current" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg} ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <h4 className="font-bold text-white text-sm">{meta.name}</h4>
                    </div>
                    {/* Compact renderer for horizontal feed */}
                    <div className="h-16">
                      {renderWidgetContent(widget.id, "small")}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. Priority Feed (Dynamic Grid) */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dashboard Matrix</h3>
          <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400">Add Integration +</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">
          {gridWidgets.map((widget) => {
            const meta = WIDGET_MANIFEST.find(m => m.id === widget.id)!;
            const isMenuOpen = activeMenu === widget.id;

            return (
              <div 
                key={widget.id} 
                className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative group overflow-hidden transition-all duration-300 hover:shadow-md ${getSizeClass(widget.size)} flex flex-col`}
              >
                {/* Widget Header */}
                <div className="flex justify-between items-start mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.bg} ${meta.color}`}>
                      {meta.icon}
                    </div>
                    {widget.size !== "small" && <h4 className="font-bold text-gray-900 text-sm">{meta.name}</h4>}
                  </div>
                  
                  {/* Context Menu Button (Long Press Simulation) */}
                  <button 
                    onClick={() => setActiveMenu(isMenuOpen ? null : widget.id)}
                    className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Widget Context Menu Overlay */}
                {isMenuOpen && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-4 flex flex-col gap-2 justify-center animate-in fade-in zoom-in-95 duration-100">
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
                    <button onClick={() => setActiveMenu(null)} className="absolute top-2 right-2 text-gray-400 p-1">✕</button>
                  </div>
                )}

                {/* Content Renderer */}
                <div className="flex-1 overflow-hidden">
                  {renderWidgetContent(widget.id, widget.size)}
                </div>
              </div>
            );
          })}

          {/* Add Widget Ghost Card */}
          <button className="col-span-1 row-span-1 bg-white/5 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/50 hover:bg-white/10 hover:border-white/40 transition-all group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="text-xl">+</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Add</span>
          </button>
        </div>

      </main>

      {/* OS Bottom Dock (Mobile Only) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex justify-around items-center z-50">
        <button className="text-white bg-white/20 p-3 rounded-2xl"><Command size={20}/></button>
        <button className="text-gray-400 hover:text-white transition-colors p-3"><Mail size={20}/></button>
        <button className="text-gray-400 hover:text-white transition-colors p-3"><Calendar size={20}/></button>
        <button className="text-gray-400 hover:text-white transition-colors p-3"><CheckSquare size={20}/></button>
      </div>

    </div>
  );
}
