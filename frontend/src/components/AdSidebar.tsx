import React from 'react';

export default function AdSidebar() {
  return (
    <div className="w-full max-w-[300px] h-[600px] bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm relative overflow-hidden group hover:bg-gray-50 transition-colors mx-auto sticky top-24">
      <span className="absolute top-2 right-3 text-[9px] uppercase tracking-wider font-bold text-gray-400">Advertisement</span>
      <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <span className="opacity-60 font-medium text-center px-4">Ad Space<br/>(300x600)</span>
    </div>
  );
}
