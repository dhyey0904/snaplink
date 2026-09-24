"use client";

import React, { useEffect, useState } from 'react';

export default function MaintenanceModal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when maintenance mode is active
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xl">
      <div className="bg-white max-w-lg w-full rounded-3xl p-10 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Scheduled Maintenance</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          SnapLink is currently undergoing scheduled server upgrades to bring you a faster and more reliable experience. We will be back online shortly.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 inline-block">
          <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Expected Return</p>
          <p className="text-blue-600 font-bold mt-1">October 1st, 2026</p>
        </div>
      </div>
    </div>
  );
}
