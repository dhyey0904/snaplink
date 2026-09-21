"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function HeroSection() {
  // Bio builder mock state
  const [bioName, setBioName] = useState('Alex Creator');
  const [bioColor, setBioColor] = useState('bg-blue-600');

  // File Dropzone mock state
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
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white pt-8 pb-16">
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-white opacity-5 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-black opacity-10 rounded-full filter blur-2xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              
              {/* Hero Text */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Secure File Sharing & Digital Identity
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                  Secure File Sharing & <br/>3D Digital <span className="text-blue-200">vCards</span>
                </h1>
                <p className="text-base md:text-lg font-medium text-blue-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  SnapLink is the ultimate platform for professionals. Send 1GB files with self-destructing timers and generate stunning 3D digital business cards.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/register" className="px-6 py-3 rounded-xl font-bold text-[#1a73e8] bg-white hover:bg-blue-50 transition-colors shadow-lg text-base">
                    Get Started Free
                  </Link>
                  <Link href="#features" className="px-6 py-3 rounded-xl font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-colors text-base">
                    See how it works
                  </Link>
                </div>
              </div>

              {/* Interactive Split Mockup (Dropzone + vCard) */}
              <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-6">
                
                {/* File Dropzone Mockup */}
                <div 
                  className={`flex-1 bg-white rounded-3xl p-5 shadow-2xl transition-all duration-300 border-4 flex flex-col items-center justify-center text-center min-h-[260px] ${isDragging ? 'border-[#1a73e8] scale-105 bg-blue-50' : 'border-transparent'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadState === 'idle' && (
                    <>
                      <div className="w-20 h-20 bg-blue-100 text-[#1a73e8] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      </div>
                      <p className="text-xl font-bold text-gray-800 mb-2">Drop a file here</p>
                      <p className="text-gray-500 text-sm">Up to 1GB. Self-destructs in 5 mins.</p>
                      <div className="mt-6 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600">Try dragging any file here!</div>
                    </>
                  )}
                  {uploadState === 'uploading' && (
                    <>
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-[#1a73e8] rounded-full animate-spin mb-4"></div>
                      <p className="text-xl font-bold text-gray-800">Encrypting & Uploading...</p>
                    </>
                  )}
                  {uploadState === 'done' && (
                    <>
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p className="text-xl font-bold text-gray-800 mb-2">Ready to Share</p>
                      <Link href="/register" className="mt-4 px-6 py-2 bg-[#1a73e8] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Sign up to get link</Link>
                    </>
                  )}
                </div>

                {/* 3D vCard Mockup */}
                <div className="flex-1 perspective-1000 flex items-center justify-center p-4">
                  <div className="w-full max-w-[200px] aspect-[5/8] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl p-5 flex flex-col justify-between transform rotate-y-[-15deg] rotate-x-[10deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 border border-gray-700 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-white/10 rounded-full border border-white/20"></div>
                      <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    </div>
                    <div>
                      <div className="text-white font-bold text-xl mb-1">Alex Creator</div>
                      <div className="text-gray-400 text-sm">CEO, SnapLink</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* LIVE LINK-IN-BIO SHOWCASE */}
  );
}
