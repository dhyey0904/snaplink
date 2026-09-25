"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

// The available widgets in our mock store
const AVAILABLE_WIDGETS = [
  { id: 'calendar', name: 'Google Calendar', icon: '📅', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: 'github', name: 'GitHub', icon: '💻', color: 'text-gray-800', bg: 'bg-gray-100', border: 'border-gray-200' },
  { id: 'gmail', name: 'Gmail', icon: '📧', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
  { id: 'stripe', name: 'Stripe', icon: '💰', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { id: 'drive', name: 'Google Drive', icon: '☁️', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { id: 'website', name: 'Web Analytics', icon: '🌐', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
];

export default function CommandCenterPage() {
  const [greeting, setGreeting] = useState("Welcome back");
  
  // Widget State
  const [activeWidgets, setActiveWidgets] = useState<string[]>(['calendar', 'github']);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Load saved widgets from local storage
    const saved = localStorage.getItem('snap_os_widgets');
    if (saved) {
      setActiveWidgets(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const toggleWidget = (id: string) => {
    let newWidgets = [];
    if (activeWidgets.includes(id)) {
      newWidgets = activeWidgets.filter(w => w !== id);
    } else {
      newWidgets = [...activeWidgets, id];
    }
    setActiveWidgets(newWidgets);
    localStorage.setItem('snap_os_widgets', JSON.stringify(newWidgets));
  };

  // Mock Widget Renderers
  const renderWidget = (id: string) => {
    switch(id) {
      case 'calendar':
        return (
          <div key={id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-blue-300 transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl border border-blue-100">📅</div>
              <div>
                <p className="text-xs font-bold text-blue-600 mb-0.5">IN 45 MINS (GOOGLE MEET)</p>
                <h4 className="text-gray-900 font-bold text-base line-clamp-1">Client Sync: Q4 Roadmap</h4>
              </div>
            </div>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors shrink-0 ml-4">
              Join
            </button>
          </div>
        );
      case 'github':
        return (
          <div key={id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-gray-300 transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl border border-gray-200">💻</div>
              <div>
                <p className="text-xs font-bold text-gray-600 mb-0.5">ACTION REQUIRED</p>
                <h4 className="text-gray-900 font-bold text-base line-clamp-1">2 Pull Requests Waiting</h4>
              </div>
            </div>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 group-hover:bg-gray-900 group-hover:text-white transition-colors shrink-0 ml-4">
              Review
            </button>
          </div>
        );
      case 'gmail':
        return (
          <div key={id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-red-300 transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-xl border border-red-100">📧</div>
              <div>
                <p className="text-xs font-bold text-red-500 mb-0.5">INBOX (3 UNREAD)</p>
                <h4 className="text-gray-900 font-bold text-base line-clamp-1">Invoice #8843 from AWS</h4>
              </div>
            </div>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-colors shrink-0 ml-4">
              Reply
            </button>
          </div>
        );
      case 'stripe':
        return (
          <div key={id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-purple-300 transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl border border-purple-100">💰</div>
              <div>
                <p className="text-xs font-bold text-purple-600 mb-0.5">TODAY'S REVENUE</p>
                <h4 className="text-gray-900 font-bold text-base line-clamp-1">₹12,500 (+14%)</h4>
              </div>
            </div>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 ml-4">
              Payouts
            </button>
          </div>
        );
      case 'drive':
        return (
          <div key={id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-emerald-300 transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-xl border border-emerald-100">☁️</div>
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-emerald-600">STORAGE USED</p>
                  <span className="text-xs font-bold text-gray-500">72%</span>
                </div>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[72%]"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'website':
        return (
          <div key={id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-orange-300 transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl border border-orange-100">🌐</div>
              <div>
                <p className="text-xs font-bold text-orange-600 mb-0.5">LIVE VISITORS</p>
                <h4 className="text-gray-900 font-bold text-base line-clamp-1">1,245 Active Users</h4>
              </div>
            </div>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0 ml-4">
              Analytics
            </button>
          </div>
        );
      default: return null;
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#FAFAFA]"></div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans selection:bg-blue-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 w-full py-8 lg:py-12 relative z-20 mb-20">
        
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Snap OS • Systems Nominal</h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              {greeting}, Dhyey
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsWidgetModalOpen(true)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors active:scale-95"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add Widget
            </button>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 shadow-lg text-white mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/10 text-2xl shadow-inner">
              ✨
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                Today's Summary
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono border border-white/10 shadow-sm">AI Generated</span>
              </h3>
              <ul className="space-y-2 text-sm sm:text-base text-blue-50 font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>You have <strong className="text-white">3 unread client emails</strong> requiring a response.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Your <strong className="text-white">API deployment failed</strong> on GitHub (SnapLinks-Core).</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Stripe processed <strong className="text-white">₹12,500</strong> in revenue yesterday.</span>
                </li>
              </ul>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
                  Open Inbox
                </button>
                <button className="bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-500/50 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  View Deployment Logs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Priority Feed */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Priority Action Items</h3>
          <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{activeWidgets.length} Active</span>
        </div>
        
        {activeWidgets.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center flex flex-col items-center justify-center mb-10">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
              <span className="text-3xl grayscale opacity-50">🧩</span>
            </div>
            <h4 className="text-gray-900 font-bold mb-2">No widgets active</h4>
            <p className="text-gray-500 text-sm max-w-sm mb-6">Your command center is empty. Add widgets to integrate Gmail, GitHub, Stripe, and more.</p>
            <button onClick={() => setIsWidgetModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
              Open Widget Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {activeWidgets.map(id => renderWidget(id))}
          </div>
        )}

      </main>

      <Footer />

      {/* Widget Modal */}
      {isWidgetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsWidgetModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Widgets</h3>
                <p className="text-xs text-gray-500 mt-0.5">Customize your Snap OS command center</p>
              </div>
              <button onClick={() => setIsWidgetModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/50 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-2 flex-1">
              {AVAILABLE_WIDGETS.map(widget => {
                const isActive = activeWidgets.includes(widget.id);
                return (
                  <button 
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      isActive ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${widget.bg} ${widget.border}`}>
                        {widget.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{widget.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Integration</p>
                      </div>
                    </div>
                    <div>
                      {isActive ? (
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <button onClick={() => setIsWidgetModalOpen(false)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
