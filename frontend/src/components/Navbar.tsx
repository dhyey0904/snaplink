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
    <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex sm:flex-row justify-between sm:h-16 items-center py-3 sm:py-0">
          
          <div className="flex justify-between items-center w-full sm:w-auto">
            <Link href={isAdmin ? "/admin" : isDashboard ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-[#202124]">
                Snap<span className={isAdmin ? "text-[#ea4335]" : "text-[#1a73e8]"}>{isAdmin ? "Admin" : "Link"}</span>
              </span>
            </Link>
            
            {/* Mobile Hamburger Icon */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="block sm:hidden md:hidden lg:hidden text-gray-500 hover:text-gray-700 p-2 focus:outline-none"
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
                <Link href="/dashboard/bio" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/bio' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Bio Page
                </Link>
                <Link href="/dashboard/links" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/links' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  URL Shortener
                </Link>
                <Link href="/dashboard/vcard" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/vcard' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  Business Card
                </Link>
                <Link href="/dashboard/files" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/files' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  File Sharing
                </Link>
                <Link href="/dashboard/api" className={`text-sm font-medium transition-colors py-5 ${pathname === '/dashboard/api' ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}>
                  API Access
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-[#5f6368] hover:text-[#d93025] transition-colors ml-4">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/blog" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">Blog</Link>
                <Link href="/login" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="text-sm font-medium bg-[#1a73e8] text-white px-5 py-2.5 rounded-full hover:bg-[#1557b0] transition-colors focus:ring-4 focus:ring-[#1a73e8]/20">
                  Get Started
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
                <Link href="/dashboard/bio" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/bio' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Bio Page</Link>
                <Link href="/dashboard/links" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/links' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>URL Shortener</Link>
                <Link href="/dashboard/vcard" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/vcard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Business Card</Link>
                <Link href="/dashboard/files" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/files' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>File Sharing</Link>
                <Link href="/dashboard/api" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === '/dashboard/api' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>API Access</Link>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg mt-4 border-t border-gray-100">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/blog" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                  <Link href="/login" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                <Link href="/register" className="block px-3 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
