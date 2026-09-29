"use client";
﻿import React, { useState } from 'react';

export default function FileDropzoneMock() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadState('uploading');
    setTimeout(() => setUploadState('done'), 2500);
  };

  return (
    <div 
      className={`flex-1 bg-white rounded-3xl p-5 shadow-2xl transition-all duration-300 border-4 flex flex-col items-center justify-center text-center min-h-[260px] ${isDragging ? 'border-[#1a73e8] scale-105 bg-blue-50' : 'border-transparent'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {uploadState === 'idle' && (
        <div className="animate-fade-in-up">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">Drop a file here</p>
          <p className="text-sm text-gray-500">up to 50MB. Self-destructs in 5 mins.</p>
          <p className="text-xs text-blue-500 font-bold mt-4 cursor-pointer hover:underline" onClick={() => setUploadState('uploading')}>Try dropping any file here!</p>
        </div>
      )}
      
      {uploadState === 'uploading' && (
        <div className="w-full max-w-[200px] mx-auto animate-fade-in-up">
          <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
            <span>Encrypting...</span>
            <span>68%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full w-[68%] animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-500">AES-256 Military Grade</p>
        </div>
      )}

      {uploadState === 'done' && (
        <div className="w-full animate-fade-in-up">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">Ready to Share</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 truncate font-mono">snaplinks.in/f/aX9</span>
            <button className="text-blue-600 font-bold text-sm hover:text-blue-800" onClick={() => setUploadState('idle')}>Copy</button>
          </div>
        </div>
      )}
    </div>
  );
}
