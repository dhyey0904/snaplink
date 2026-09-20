"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

const APPS = [
  {
    name: "URL Shortener",
    description: "Create short, trackable links with custom WhatsApp social media preview cards.",
    href: "/dashboard/links",
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
    )
  },
  {
    name: "Link-in-Bio Page",
    description: "Build a beautiful mobile landing page for your Instagram or TikTok profile.",
    href: "/dashboard/bio",
    color: "bg-purple-500",
    lightBg: "bg-purple-50",
    textColor: "text-purple-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    )
  },
  {
    name: "3D Business Card",
    description: "Design a stunning interactive glassmorphism card that clients can save to their contacts.",
    href: "/dashboard/vcard",
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    textColor: "text-amber-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
    )
  },
  {
    name: "Secure File Sharing",
    description: "Upload PDFs, Resumes, or ZIP files securely with password protection and auto-expiry links.",
    href: "/dashboard/files",
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
    )
  },
  {
    name: "Developer API",
    description: "Unlock programmatic access to generate links automatically from your own software.",
    href: "/dashboard/api",
    color: "bg-gray-800",
    lightBg: "bg-gray-100",
    textColor: "text-gray-800",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
    )
  }
];

export default function Dashboard() {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] font-sans">
      <Navbar />



      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 w-full py-8 lg:py-12 relative z-20 mb-20">
        <div className="mb-12">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">{greeting}, Creator</h2>
          <h1 className="text-4xl md:text-5xl font-black text-[#202124] tracking-tight">Your Workspace</h1>
          <p className="text-[#5f6368] text-lg mt-4 max-w-2xl">
            Access your tools, manage links, and grow your audience from one unified dashboard.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {APPS.map((app, index) => (
            <Link key={index} href={app.href} className="group block bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-[#1a73e8] transition-all duration-300 relative overflow-hidden">
              
              
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${app.lightBg} ${app.textColor} flex items-center justify-center mb-6 shadow-sm`}>
                    {app.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#202124] mb-3">{app.name}</h3>
                  <p className="text-sm text-[#5f6368] leading-relaxed mb-8 min-h-[3rem]">{app.description}</p>
                </div>
                
                <div className={`text-sm font-bold ${app.textColor} flex items-center group-hover:translate-x-2 transition-transform duration-300`}>
                  Open Tool <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Add a "Coming Soon" card to demonstrate scalability */}
          <div className="group block bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-300 flex flex-col items-center justify-center text-center opacity-80 hover:bg-gray-100 transition-colors cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-500 mb-2">More coming soon</h3>
            <p className="text-xs text-gray-400 max-w-[150px]">We are constantly adding new tools to your workspace.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
