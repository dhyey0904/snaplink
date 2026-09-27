import React from 'react';

export default function AdBanner() {
  return (
    <div className="w-full max-w-[728px] mx-auto mt-8 mb-4 flex justify-center">
      <div className="w-full h-[90px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm relative overflow-hidden group hover:bg-gray-50 transition-colors">
        <span className="absolute top-1 right-2 text-[9px] uppercase tracking-wider font-bold text-gray-400">Advertisement</span>
        <div className="flex flex-col items-center">
          <svg className="w-6 h-6 mb-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <span className="opacity-60 font-medium">Ad Space (728x90)</span>
        </div>
      </div>
    </div>
  );
}
