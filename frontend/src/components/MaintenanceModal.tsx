"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MaintenanceModal() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Do not lock scrolling in development mode
    if (process.env.NODE_ENV === 'development') {
      document.body.style.overflow = 'unset';
      return;
    }
    
    // Check if the current page requires the backend
    const requiresBackend = 
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password' ||
      pathname?.startsWith('/dashboard') ||
      pathname?.startsWith('/admin') ||
      pathname?.startsWith('/v/') ||
      pathname?.startsWith('/f/') ||
      pathname?.startsWith('/analytics/');

    if (requiresBackend) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mounted, pathname]);

  if (!mounted) return null;
  
  // Do not show maintenance mode during local development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  // Check if the current page requires the backend
  const requiresBackend = 
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/v/') ||
    pathname?.startsWith('/f/') ||
    pathname?.startsWith('/analytics/');

  // If page doesn't require backend, hide maintenance modal
  if (!requiresBackend) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xl overflow-y-auto">
      <div className="bg-white max-w-lg w-full rounded-3xl p-10 text-center shadow-2xl animate-in fade-in zoom-in duration-300 my-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Scheduled Maintenance</h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          SnapLink is currently upgrading its core servers. While we are under maintenance, please enjoy our brand new 100% free, unlimited, browser-based tools:
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 text-left">
          <Link href="/tools" className="flex items-center gap-3 p-3 hover:bg-white rounded-xl transition-colors group">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Open Free SnapTools</p>
              <p className="text-xs text-gray-500">Merge, watermark, and edit PDFs for free.</p>
            </div>
          </Link>
        </div>
        
        <div className="inline-block text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Expected Return</p>
          <p className="text-blue-600 font-bold text-sm">October 1st, 2026</p>
        </div>
      </div>
    </div>
  );
}
