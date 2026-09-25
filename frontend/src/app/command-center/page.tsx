"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import {
  Mail, Calendar, CheckSquare, Link2,
  FolderOpen, Search, MoreHorizontal, Trash2, Pin, Command
} from "lucide-react";

type WidgetSize = "small" | "medium" | "large" | "full";

interface WidgetConfig {
  id: string;
  size: WidgetSize;
  pinned: boolean;
  order: number;
}

// Master list of all possible OS Widgets
// Master list of all possible OS Widgets
const WIDGET_MANIFEST = [
  { id: "links", name: "Link Manager", icon: <Link2 />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "files", name: "File Manager", icon: <FolderOpen />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "gmail", name: "Gmail", icon: <Mail />, color: "text-red-500", bg: "bg-red-50" },
  { id: "calendar", name: "Calendar", icon: <Calendar />, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "tasks", name: "Tasks", icon: <CheckSquare />, color: "text-indigo-500", bg: "bg-indigo-50" },
];

const DEFAULT_LAYOUT: WidgetConfig[] = [
  { id: "links", size: "medium", pinned: true, order: 1 },
  { id: "files", size: "medium", pinned: false, order: 2 },
  { id: "gmail", size: "medium", pinned: false, order: 3 },
  { id: "calendar", size: "medium", pinned: true, order: 4 },
  { id: "tasks", size: "medium", pinned: true, order: 5 }
];

export default function SnapOS() {
  const [layout, setLayout] = useState<WidgetConfig[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Welcome back");
  const [realData, setRealData] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const saved = localStorage.getItem("snap_os_layout");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Force sync with manifest if they are missing core widgets from an old save
      if (parsed.length < WIDGET_MANIFEST.length) {
        setLayout(DEFAULT_LAYOUT);
        localStorage.setItem("snap_os_layout", JSON.stringify(DEFAULT_LAYOUT));
      } else {
        setLayout(parsed);
      }
    } else {
      setLayout(DEFAULT_LAYOUT);
    }
    setIsLoaded(true);

    // Fetch real data (SnapLinks + Google)
    const fetchRealData = async () => {
      try {
        const data = await fetchAPI("/os/data");
        setRealData(data);
      } catch (err) {
        console.error("Failed to fetch real data", err);
      }
    };
    fetchRealData();
  }, []);

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/integrations/google/url", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        alert("Failed to get Google Auth URL. Ensure you are logged in.");
        setIsConnecting(false);
      }
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
    }
  };

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

  // Local state for interactive tasks widget
  const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("snapos_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: 1, text: "Welcome to Snap OS", done: true },
        { id: 2, text: "Create your first short link", done: false }
      ]);
    }
  }, []);

  const toggleTask = (id: number) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(newTasks);
    localStorage.setItem("snapos_tasks", JSON.stringify(newTasks));
  };

  const addTask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      const newTasks = [...tasks, { id: Date.now(), text: newTaskText, done: false }];
      setTasks(newTasks);
      localStorage.setItem("snapos_tasks", JSON.stringify(newTasks));
      setNewTaskText("");
    }
  };

  const removeTask = (id: number) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    localStorage.setItem("snapos_tasks", JSON.stringify(newTasks));
  };

  if (!isLoaded) return <div className="min-h-screen bg-black"></div>;

  const pinnedWidgets = layout.filter(w => w.pinned);
  const gridWidgets = layout.filter(w => !w.pinned).sort((a, b) => a.order - b.order);



  // Widget Renderer Engine
  const renderWidgetContent = (id: string, size: WidgetSize) => {
    switch (id) {
      case "links":
        const totalLinks = realData?.links?.total ?? 0;
        const totalClicks = realData?.links?.clicks ?? 0;
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-blue-500 mb-1 tracking-wider uppercase">SnapLinks</p>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">{totalLinks} Total Links</h4>
              {size === "large" || size === "full" ? (
                <div className="space-y-2 mt-4">
                  <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-700 flex justify-between">
                    <span className="font-medium truncate mr-2">Total Clicks</span>
                    <span className="font-bold">{totalClicks}</span>
                  </div>
                </div>
              ) : null}
            </div>
            {size !== "small" && (
              <a href="/dashboard/links" className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                Manage Links
              </a>
            )}
          </div>
        );
      case "files":
        const totalFiles = realData?.files?.total ?? 0;
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 mb-1 tracking-wider uppercase">Files</p>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">{totalFiles} Secure Files</h4>
            </div>
            {size !== "small" && (
              <a href="/dashboard/files" className="mt-4 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                View Files
              </a>
            )}
          </div>
        );
      case "gmail":
        const isGoogleConnected = !!realData?.google;
        const unreadCount = realData?.google?.gmail?.unread ?? 0;
        
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-red-500 mb-1 tracking-wider uppercase">Inbox</p>
              {!isGoogleConnected ? (
                <p className="text-gray-500 text-sm font-medium mt-2">Connect Google to view unread emails.</p>
              ) : (
                <>
                  <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">{unreadCount} unread emails.</h4>
                </>
              )}
            </div>
            {size !== "small" && (
              <a href="https://mail.google.com" target="_blank" className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                Open Gmail
              </a>
            )}
          </div>
        );
      case "calendar":
        const isCalConnected = !!realData?.google;
        const nextEvent = realData?.google?.calendar?.[0];
        
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-blue-500 mb-1 tracking-wider uppercase">Next Event</p>
              {!isCalConnected ? (
                <p className="text-gray-500 text-sm font-medium mt-2">Connect Google to sync calendar.</p>
              ) : !nextEvent ? (
                <p className="text-gray-500 text-sm font-medium mt-2">No upcoming events today.</p>
              ) : (
                <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight truncate">{nextEvent.summary}</h4>
              )}
            </div>
            {size !== "small" && (
              <a href={nextEvent?.link || "https://calendar.google.com"} target="_blank" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-sm text-center block">
                {nextEvent?.link ? 'Join Meeting' : 'Open Calendar'}
              </a>
            )}
          </div>
        );
      case "tasks":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-500 mb-1 tracking-wider uppercase">Tasks ({tasks.filter(t => !t.done).length} Pending)</p>
              <ul className="space-y-2 mt-3 max-h-[100px] overflow-y-auto pr-1">
                {tasks.map(t => (
                  <li key={t.id} className="flex items-center gap-2 group">
                    <button onClick={() => toggleTask(t.id)} className="shrink-0 flex items-center justify-center w-4 h-4 border-2 border-indigo-200 rounded text-indigo-600 focus:outline-none focus:border-indigo-500">
                      {t.done && <CheckSquare size={14} className="text-indigo-600 absolute" />}
                    </button>
                    <span className={`text-sm font-bold truncate flex-1 ${t.done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {t.text}
                    </span>
                    <button onClick={() => removeTask(t.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                      <Trash2 size={12}/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {size !== "small" && (
              <div className="mt-4">
                <input 
                  type="text" 
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={addTask}
                  placeholder="Add a task & press Enter" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans selection:bg-blue-500/30">
      
      <Navbar />

      {/* OS Status Bar (Hidden Desktop, visible mobile) */}
      <div className="md:hidden flex justify-between items-center px-6 pt-4 pb-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
        <span>Snap OS v1.0</span>
        <span>Secure</span>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 w-full py-4 md:py-12 relative z-20 mb-20 overflow-x-hidden">
        
        {/* 1. Greeting Card */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5">
              <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Dhyey" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{greeting}, Dhyey</h1>
              <p className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Everything is running smoothly.
              </p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm">
            <Search size={18} />
          </button>
        </div>

        {/* 3. Pinned Widgets (Horizontal Carousel) */}
        {pinnedWidgets.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <Pin size={12} /> Pinned Favorites
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
              {pinnedWidgets.map(widget => {
                const meta = WIDGET_MANIFEST.find(m => m.id === widget.id);
                if (!meta) return null;
                return (
                  <div key={`pin-${widget.id}`} className="snap-start shrink-0 w-64 bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors relative group shadow-sm">
                    <button 
                      onClick={() => togglePin(widget.id)}
                      className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pin size={14} className="fill-current" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg} ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{meta.name}</h4>
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
          <div className="flex gap-4">
            <button 
              onClick={handleConnectGoogle}
              disabled={isConnecting}
              className="text-[10px] font-bold text-green-500 uppercase tracking-widest hover:text-green-400"
            >
              {isConnecting ? "Connecting..." : "Connect Google"}
            </button>
            <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400">Add Integration +</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">
          {gridWidgets.map((widget) => {
            const meta = WIDGET_MANIFEST.find(m => m.id === widget.id);
                if (!meta) return null;
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
                <div 
                    className="flex-1 overflow-hidden cursor-pointer"
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
          })}

          {/* Add Widget Ghost Card */}
          <button className="col-span-1 row-span-1 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="text-xl text-gray-400">+</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Add Widget</span>
          </button>
        </div>

      </main>

      {/* OS Bottom Dock (Mobile Only) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-3 flex justify-around items-center z-50">
        <button className="text-blue-600 bg-blue-50 p-3 rounded-2xl"><Command size={20}/></button>
        <button className="text-gray-400 hover:text-gray-800 transition-colors p-3"><Mail size={20}/></button>
        <button className="text-gray-400 hover:text-gray-800 transition-colors p-3"><Calendar size={20}/></button>
        <button className="text-gray-400 hover:text-gray-800 transition-colors p-3"><CheckSquare size={20}/></button>
      </div>

    </div>
  );
}
