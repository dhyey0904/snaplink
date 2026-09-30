'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [isDashboard, setIsDashboard] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsAuthenticated(!!localStorage.getItem("token"));
    setIsDashboard(pathname?.startsWith('/dashboard') || !!localStorage.getItem("token"));
    setIsAdmin(pathname?.startsWith('/admin') || false);
  }, [pathname]); // Re-check on route change just in case

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsDashboard(false);
    router.push("/");
  };

  return (
<>
      {/* Global SnapPlay Announcement Banner */}
      {(pathname === '/' || pathname === '/dashboard') && (
        <Link href="/play" className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center py-2.5 px-4 text-sm font-bold hover:brightness-110 transition-all cursor-pointer relative overflow-hidden group z-[60]">
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          <span className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span><span className="underline decoration-white/40 underline-offset-2">New: Play the Daily Challenge on SnapPlay</span></span>
            <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider sm:ml-2 shadow-sm inline-block mt-1 sm:mt-0 group-hover:scale-105 transition-transform">Play Now &rarr;</span>
          </span>
        </Link>
      )}
      <nav className="w-full border-b border-[#dadce0] bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex sm:flex-row justify-between sm:h-16 items-center py-3 sm:py-0">
          
          <div className="flex justify-between items-center w-full sm:w-auto">
            <Link href={isAdmin ? "/admin" : isDashboard ? "/dashboard" : "/"} id="snaplinks-logo" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-bold tracking-tight text-[#202124] group-hover:scale-105 transition-transform duration-300 flex">
                <span className="flex">
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '0ms' }}>S</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '100ms' }}>n</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '200ms' }}>a</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '300ms' }}>p</span>
                </span>
                {isAdmin ? (
                  <span className="text-[#ea4335] flex">
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '400ms' }}>A</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '500ms' }}>d</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '600ms' }}>m</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '700ms' }}>i</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '800ms' }}>n</span>
                  </span>
                ) : (
                  <span className="text-[#1557b0] flex">
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '400ms' }}>L</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '500ms' }}>i</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '600ms' }}>n</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '700ms' }}>k</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '800ms' }}>s</span>
                  </span>
                )}
              </span>
            </Link>
            
            <div className={`flex items-center gap-2 sm:hidden transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
              {/* Mobile SnapTools Link (Landing Page Only) */}
              {!isAdmin && !isDashboard && (
                <Link href="/tools" className="flex items-center gap-1 text-[13px] font-bold text-[#1557b0] mr-1">
                  SnapTools <span className="bg-blue-100 text-[#1557b0] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">Free</span>
                </Link>
              )}
              {/* Mobile Hamburger Icon */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                className="text-gray-500 hover:text-gray-700 p-2 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Links (Exact Original) */}
          <div className={`hidden sm:flex md:flex items-center gap-4 lg:gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide mt-3 sm:mt-0 pb-1 sm:pb-0 w-full sm:w-auto transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            {isAdmin ? (
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Exit Admin
              </Link>
            ) : isDashboard ? (
              <>
                <Link href="/dashboard" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard' ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Overview
                </Link>
                <Link href="/tools" className={`text-sm font-medium transition-colors py-5 flex items-center gap-1 ${pathname === '/tools' ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  SnapTools
                </Link>
                  <Link href="/bridge" className={`text-sm font-medium transition-colors py-5 flex items-center gap-1 ${pathname.startsWith('/bridge') || pathname.startsWith('/b/') ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                    SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-0.5">New</span>
                  </Link>
                <Link href="/dashboard/bio" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/bio' ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Bio
                </Link>
                <Link href="/dashboard/links" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/links' ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Links
                </Link>
                <Link href="/dashboard/vcard" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/vcard' ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  vCard
                </Link>
                <Link href="/dashboard/files" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/files' ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Files
                </Link>
                <Link href="/dashboard/api" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/api' ? 'text-[#1557b0] border-b-2 border-[#1557b0]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  API
                </Link>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button onClick={handleLogout} className="text-sm font-bold bg-gray-100 text-gray-700 px-5 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/tools" className="flex items-center gap-2 text-sm font-bold text-[#1557b0] hover:text-[#1557b0] transition-colors">
                  SnapTools <span className="bg-blue-100 text-[#1557b0] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">Free</span>
                </Link>
                <Link href="/bridge" className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-[#1557b0] transition-colors">SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">New</span></Link>
                <Link href="/play" className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1">
                  <span>🎮</span> Play
                </Link>
                <Link href="/blog" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">Blog</Link>
                <div className="w-px h-4 bg-gray-300 mx-2 hidden sm:block"></div>
                <Link href="/login" className="text-sm font-bold text-[#5f6368] hover:text-[#202124] transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="text-sm font-bold bg-[#1557b0] text-white px-5 py-2.5 rounded-full hover:bg-[#1557b0] transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-[#1a73e8]/20">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="block sm:hidden md:hidden lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {isAdmin ? (
              <Link href="/dashboard" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                Exit Admin
              </Link>
            ) : isDashboard ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Overview</Link>
                <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/tools' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>SnapTools</Link>
                  <Link href="/bridge" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg flex items-center justify-between ${pathname.startsWith('/bridge') || pathname.startsWith('/b/') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2">SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">New</span></div>
                  </Link>
                <Link href="/dashboard/bio" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/bio' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Bio</Link>
                <Link href="/dashboard/links" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/links' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Links</Link>
                <Link href="/dashboard/vcard" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/vcard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>vCard</Link>
                <Link href="/dashboard/files" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/files' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Files</Link>
                <Link href="/dashboard/api" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/api' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>API</Link>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex items-center gap-3 px-3 pb-3">
                    <div className="w-8 h-8 bg-[#1557b0] text-white rounded-full flex items-center justify-center font-bold text-xs">U</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">User</span>
                      <span className="text-xs text-gray-500">Free Plan</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    Logout
                  </button>
                </div>
              </>
            ) : (
                <>
                <Link href="/tools" className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>SnapTools</Link>
                <Link href="/bridge" className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2">SnapBridge <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">New</span></div>
                </Link>
                <Link href="/play"  className="block px-3 py-3 text-base font-bold text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>🎮</span> SnapPlay
                </Link>
                <Link href="/blog" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                <Link href="/login" className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 rounded-lg mt-2 border-t border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                <Link href="/register" className="block px-3 py-3 text-base font-bold text-white bg-[#1557b0] hover:bg-[#1557b0] text-center rounded-lg shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Secondary Tools Navbar (iLovePDF style) */}
      {pathname?.startsWith('/tools') && (
        <div className="w-full bg-white border-t border-[#dadce0] shadow-sm hidden md:block">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-10 h-[46px]">
              <Link href="/tools/merge-pdf" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">Merge PDF</Link>
              <Link href="/tools/split-pdf" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">Split PDF</Link>
              <Link href="/tools/compress-pdf" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">Compress PDF</Link>
              
              <Link href="/tools/image-compressor" className="text-[13px] font-bold text-gray-800 hover:text-[#1557b0] tracking-wider uppercase transition-colors">Image Compressor</Link>
                
                {/* All PDF Tools Dropdown */}
              <div className="relative group cursor-pointer flex items-center h-[46px]">
                <div className="flex items-center gap-1 text-[13px] font-bold text-gray-800 group-hover:text-[#1557b0] tracking-wider uppercase transition-colors">
                  All PDF Tools
                  <svg className="w-3 h-3 text-gray-500 group-hover:text-[#1557b0] group-hover:-rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                {/* Massive 5-Column Mega Menu */}
                <div className="absolute top-[46px] right-0 w-[950px] bg-white border border-gray-100 shadow-xl rounded-b-xl p-6 hidden group-hover:block z-50">
                  <div className="grid grid-cols-5 gap-4">
                    {/* ORGANIZE PDF */}
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Organize PDF</div>
                      <div className="space-y-0.5">
                        <Link href="/tools/merge-pdf" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div>
                          Merge PDF
                        </Link>
                        <Link href="/tools/split-pdf" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg></div>
                          Split PDF
                        </Link>
                        <Link href="/tools/rotate-pdf" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></div>
                          Rotate PDF
                        </Link>
                      </div>
                    </div>

                    {/* OPTIMIZE PDF */}
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Optimize PDF</div>
                      <div className="space-y-0.5">
                        <Link href="/tools/compress-pdf" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></div>
                          Compress PDF
                        </Link>
                      </div>
                    </div>

                    {/* CONVERT TO PDF */}
                    

                    {/* CONVERT FROM PDF */}
                    

                    {/* EDIT & SECURITY */}
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Edit & Security</div>
                      <div className="space-y-0.5">
                        <Link href="/tools/watermark-pdf" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg></div>
                          Watermark PDF
                        </Link>
                        <Link href="/tools/page-numbers" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg></div>
                          Page Numbers
                        </Link>
                        <Link href="/tools/unlock-pdf" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg></div>
                          Unlock PDF
                        </Link>
                        <Link href="/tools/protect-pdf" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                          <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
                          Protect PDF
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
