import re

navbar_code = """'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');

  const mainLinks = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'Bio Page', href: '/dashboard/bio' },
    { name: 'URL Shortener', href: '/dashboard/links' },
  ];

  const moreLinks = [
    { name: 'Business Card', href: '/dashboard/vcard' },
    { name: 'File Sharing', href: '/dashboard/files' },
    { name: 'API Access', href: '/dashboard/api' },
  ];

  return (
    <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center flex-shrink-0">
            <Link href={isAdmin ? "/admin" : isDashboard ? "/dashboard" : "/"} className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-[#202124]">
                Snap<span className={isAdmin ? "text-[#ea4335]" : "text-[#1a73e8]"}>{isAdmin ? "Admin" : "Link"}</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:justify-end flex-1 ml-6 space-x-2">
            {isAdmin ? (
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                Exit Admin
              </Link>
            ) : isDashboard ? (
              <>
                {mainLinks.map(link => (
                  <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors h-16 flex items-center px-4 border-b-2 ${pathname === link.href ? 'text-[#1a73e8] border-[#1a73e8]' : 'text-[#5f6368] border-transparent hover:text-[#202124]'}`}>
                    {link.name}
                  </Link>
                ))}
                
                {/* More Dropdown */}
                <div className="relative h-16 flex items-center px-2" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    className={`text-sm font-medium flex items-center gap-1 transition-colors px-2 ${moreLinks.some(l => pathname === l.href) ? 'text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}
                  >
                    More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  
                  {isMoreDropdownOpen && (
                    <div className="absolute top-14 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      {moreLinks.map(link => (
                        <Link 
                          key={link.href} 
                          href={link.href}
                          onClick={() => setIsMoreDropdownOpen(false)}
                          className={`block px-4 py-2.5 text-sm ${pathname === link.href ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-5 w-px bg-gray-200 mx-2"></div>

                <button onClick={handleLogout} className="text-sm font-medium text-[#5f6368] hover:text-[#d93025] transition-colors px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors px-4 py-2">
                  Sign in
                </Link>
                <Link href="/register" className="text-sm font-medium bg-[#1a73e8] text-white px-5 py-2.5 rounded-full hover:bg-[#1557b0] transition-colors focus:ring-4 focus:ring-[#1a73e8]/20 ml-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden justify-end flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {isAdmin ? (
              <Link href="/dashboard" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                Exit Admin
              </Link>
            ) : isDashboard ? (
              <>
                {[...mainLinks, ...moreLinks].map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-3 text-base font-medium rounded-lg ${pathname === link.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button onClick={handleLogout} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg mt-4 border-t border-gray-100">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  Sign in
                </Link>
                <Link href="/register" className="block px-3 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
"""

with open('e:/snaplink/frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(navbar_code)
print("Navbar rewritten securely!")
