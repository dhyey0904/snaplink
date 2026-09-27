'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <nav className="w-full border-b border-[#dadce0] bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex sm:flex-row justify-between sm:h-16 items-center py-3 sm:py-0">
          
          <div className="flex justify-between items-center w-full sm:w-auto">
            <Link href={isAdmin ? "/admin" : isDashboard ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center group">
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
                  <span className="text-[#1a73e8] flex">
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '400ms' }}>L</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '500ms' }}>i</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '600ms' }}>n</span>
                    <span className="inline-block animate-word-wave" style={{ animationDelay: '700ms' }}>k</span>
                  </span>
                )}
              </span>
            </Link>
            
            <div className="flex items-center gap-2 sm:hidden">
              {/* Mobile SnapTools Link (Landing Page Only) */}
              {!isAdmin && !isDashboard && (
                <Link href="/tools" className="flex items-center gap-1 text-[13px] font-bold text-[#1a73e8] mr-1">
                  SnapTools <span className="bg-blue-100 text-[#1a73e8] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">Free</span>
                </Link>
              )}
              {/* Mobile Hamburger Icon */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
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
          <div className="hidden sm:flex md:flex items-center gap-4 lg:gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide mt-3 sm:mt-0 pb-1 sm:pb-0 w-full sm:w-auto">
            {isAdmin ? (
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Exit Admin
              </Link>
            ) : isDashboard ? (
              <>
                <Link href="/dashboard" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Overview
                </Link>
                <Link href="/tools" className={`text-sm font-medium transition-colors py-5 flex items-center gap-1 ${pathname === '/tools' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  SnapTools
                </Link>
                <Link href="/dashboard/bio" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/bio' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Bio
                </Link>
                <Link href="/dashboard/links" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/links' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Links
                </Link>
                <Link href="/dashboard/vcard" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/vcard' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  vCard
                </Link>
                <Link href="/dashboard/files" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/files' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Files
                </Link>
                <Link href="/dashboard/api" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/api' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  API
                </Link>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button onClick={handleLogout} className="text-sm font-bold bg-gray-100 text-gray-700 px-5 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/tools" className="flex items-center gap-2 text-sm font-bold text-[#1a73e8] hover:text-[#1557b0] transition-colors">
                  SnapTools <span className="bg-blue-100 text-[#1a73e8] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">Free</span>
                </Link>
                <Link href="/blog" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">Blog</Link>
                <div className="w-px h-4 bg-gray-300 mx-2 hidden sm:block"></div>
                <Link href="/login" className="text-sm font-bold text-[#5f6368] hover:text-[#202124] transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="text-sm font-bold bg-[#1a73e8] text-white px-5 py-2.5 rounded-full hover:bg-[#1557b0] transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-[#1a73e8]/20">
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
                <Link href="/dashboard/bio" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/bio' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Bio</Link>
                <Link href="/dashboard/links" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/links' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Links</Link>
                <Link href="/dashboard/vcard" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/vcard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>vCard</Link>
                <Link href="/dashboard/files" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/files' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Files</Link>
                <Link href="/dashboard/api" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/api' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>API</Link>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex items-center gap-3 px-3 pb-3">
                    <div className="w-8 h-8 bg-[#1a73e8] text-white rounded-full flex items-center justify-center font-bold text-xs">U</div>
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
                <Link href="/blog" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                <Link href="/login" className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 rounded-lg mt-2 border-t border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                <Link href="/register" className="block px-3 py-3 text-base font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] text-center rounded-lg shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
