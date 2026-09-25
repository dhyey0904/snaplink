"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CommandCenterPage() {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add Widget
            </button>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 shadow-lg text-white mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                Today's Summary
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono border border-white/10">AI Generated</span>
              </h3>
              <ul className="space-y-2 text-sm sm:text-base text-blue-50 font-medium leading-relaxed">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  You have <strong className="text-white">3 unread client emails</strong> requiring a response.
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Your <strong className="text-white">API deployment failed</strong> on GitHub (SnapLinks-Core).
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Stripe processed <strong className="text-white">₹12,500</strong> in revenue yesterday.
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

        {/* Priority Feed */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Priority Action Items</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          
          {/* Calendar Widget */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-gray-300 transition-colors flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-600 mb-0.5">IN 45 MINS (GOOGLE MEET)</p>
                <h4 className="text-gray-900 font-bold text-base">Client Sync: Q4 Roadmap</h4>
              </div>
            </div>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
              Join Now
            </button>
          </div>

          {/* GitHub Widget */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-gray-300 transition-colors flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 border border-red-100">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-red-600 mb-0.5">ACTION REQUIRED</p>
                <h4 className="text-gray-900 font-bold text-base">2 Pull Requests Waiting</h4>
              </div>
            </div>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 transition-colors">
              Review
            </button>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
