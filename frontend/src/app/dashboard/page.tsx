'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function DashboardOverview() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-[#202124]">
                Snap<span className="text-[#1a73e8]">Link</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-[#1a73e8] border-b-2 border-[#1a73e8] py-5">
                Overview
              </Link>
              <Link href="/dashboard/bio" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                Bio Page
              </Link>
              <Link href="/dashboard/links" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                URL Shortener
              </Link>
              <Link href="/dashboard/vcard" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                Business Card
              </Link>
              <Link href="/dashboard/api" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                API Access
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-[#5f6368] hover:text-[#d93025] transition-colors ml-4">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Hub Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#202124] mb-2">Welcome to SnapLink</h1>
          <p className="text-lg text-[#5f6368]">Select a tool below to get started and build your online presence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: URL Shortener */}
          <Link href="/dashboard/links" className="group bg-white p-8 rounded-3xl border border-[#dadce0] shadow-sm hover:shadow-lg hover:border-[#1a73e8] transition-all flex flex-col justify-between cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-[#202124] mb-3">URL Shortener</h2>
              <p className="text-[#5f6368] leading-relaxed">Create short, trackable links with custom WhatsApp social media preview cards.</p>
            </div>
            <div className="mt-8 flex items-center text-[#1a73e8] font-bold relative z-10 group-hover:translate-x-2 transition-transform">
              Launch App <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </Link>

          {/* Card 2: Bio Page */}
          <Link href="/dashboard/bio" className="group bg-white p-8 rounded-3xl border border-[#dadce0] shadow-sm hover:shadow-lg hover:border-purple-500 transition-all flex flex-col justify-between cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-[#202124] mb-3">Link-in-Bio Page</h2>
              <p className="text-[#5f6368] leading-relaxed">Build a beautiful mobile landing page for your Instagram or TikTok profile.</p>
            </div>
            <div className="mt-8 flex items-center text-purple-600 font-bold relative z-10 group-hover:translate-x-2 transition-transform">
              Launch App <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </Link>

          {/* Card 3: Business Card */}
          <Link href="/dashboard/vcard" className="group bg-white p-8 rounded-3xl border border-[#dadce0] shadow-sm hover:shadow-lg hover:border-amber-500 transition-all flex flex-col justify-between cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-[#202124] mb-3">3D Business Card</h2>
              <p className="text-[#5f6368] leading-relaxed">Design a stunning interactive glassmorphism card that clients can save to their contacts.</p>
            </div>
            <div className="mt-8 flex items-center text-amber-600 font-bold relative z-10 group-hover:translate-x-2 transition-transform">
              Launch App <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </Link>

          {/* Card 4: Developer API */}
          <Link href="/dashboard/api" className="group bg-[#202124] p-8 rounded-3xl shadow-md hover:shadow-xl hover:ring-2 hover:ring-gray-400 transition-all flex flex-col justify-between cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gray-800 text-white border border-gray-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Developer API</h2>
              <p className="text-gray-400 leading-relaxed">Unlock programmatic access to generate links automatically from your own software.</p>
            </div>
            <div className="mt-8 flex items-center text-white font-bold relative z-10 group-hover:translate-x-2 transition-transform">
              Manage Keys <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
}
