"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import QRCode from 'react-qr-code';

export default function Home() {
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION: File Sharing & vCard Focus */}
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
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Drop a file here</h3>
                      <p className="text-gray-500 text-sm">Up to 1GB. Self-destructs in 5 mins.</p>
                      <div className="mt-6 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600">Try dragging any file here!</div>
                    </>
                  )}
                  {uploadState === 'uploading' && (
                    <>
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-[#1a73e8] rounded-full animate-spin mb-4"></div>
                      <h3 className="text-xl font-bold text-gray-800">Encrypting & Uploading...</h3>
                    </>
                  )}
                  {uploadState === 'done' && (
                    <>
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Share</h3>
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
        <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-sm font-bold text-blue-700 mb-6 uppercase tracking-wider">
                  Link-in-Bio
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#202124] mb-6 leading-tight">
                  Stop using boring generic bios.
                </h2>
                <p className="text-[#5f6368] text-xl mb-10 leading-relaxed">
                  SnapLink offers beautiful, animated, and fully customizable Biolink pages. Let your personality shine with mesh gradients, verified badges, and dynamic cards.
                </p>
                
                {/* Live Builder Controls */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                    Live Customizer
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input type="text" value={bioName} onChange={e => setBioName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                      <div className="flex gap-3">
                        {['bg-blue-600', 'bg-purple-600', 'bg-pink-500', 'bg-green-500', 'bg-black'].map(color => (
                          <button 
                            key={color} 
                            onClick={() => setBioColor(color)}
                            className={`w-8 h-8 rounded-full ${color} ${bioColor === color ? 'ring-4 ring-offset-2 ring-gray-300 transform scale-110' : ''} transition-all shadow-sm`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/register" className="inline-flex items-center gap-2 font-bold text-[#1a73e8] hover:text-blue-700 text-lg transition-colors">
                  Create your free bio page 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
              </div>

              {/* Phone Mockup */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
                  
                  {/* Phone Screen */}
                  <div className={`w-full h-full rounded-[2.5rem] ${bioColor} overflow-hidden relative flex flex-col items-center pt-16 px-4 transition-colors duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md p-1 mb-4 shadow-xl">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl overflow-hidden">
                        👤
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-1 relative z-10">
                      <h3 className="text-xl font-bold text-white tracking-tight">{bioName}</h3>
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                    <p className="text-white/80 text-sm mb-8 text-center relative z-10">Digital Creator & Designer</p>

                    <div className="w-full space-y-3 relative z-10">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-full py-3 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white font-medium hover:bg-white/20 transition-colors cursor-pointer shadow-sm">
                          {i === 1 ? 'My Portfolio' : i === 2 ? 'Latest Video' : 'Contact Me'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SMART URL SHORTENER & ANALYTICS SHOWCASE */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124]">And that's just the <span className="text-[#1a73e8]">beginning.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Feature 1: URL Shortener */}
              <div className="bg-gray-50 rounded-[2rem] p-8 sm:p-12 border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#202124] mb-4">Smart URL Shortener</h3>
                <p className="text-[#5f6368] text-lg mb-8 leading-relaxed">
                  We haven't forgotten the basics. Create branded short links instantly. Fully customize your OpenGraph metadata for perfect social media previews every single time.
                </p>
                {/* Mini Link Mockup */}
                <div className="w-full h-32 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-center px-6 group-hover:border-yellow-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 line-through">snaplink.com/very-long-ugly-url-1234</span>
                      <span className="text-lg font-bold text-[#1a73e8]">snap.link/launch</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Analytics */}
              <div className="bg-gray-50 rounded-[2rem] p-8 sm:p-12 border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 bg-blue-100 text-[#1a73e8] rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#202124] mb-4">Real-Time Analytics</h3>
                <p className="text-[#5f6368] text-lg mb-8 leading-relaxed">
                  Track every click, scan, and download. Get detailed insights on referrers, devices, and locations without the bloated complexity of Google Analytics.
                </p>
                {/* Mini Chart Mockup */}
                <div className="w-full h-32 flex items-end justify-between px-4 pb-2 border-b-2 border-l-2 border-gray-200 relative">
                  <div className="w-8 bg-blue-200 rounded-t-sm h-[30%] group-hover:h-[40%] transition-all duration-500"></div>
                  <div className="w-8 bg-blue-300 rounded-t-sm h-[50%] group-hover:h-[60%] transition-all duration-500 delay-75"></div>
                  <div className="w-8 bg-blue-400 rounded-t-sm h-[40%] group-hover:h-[80%] transition-all duration-500 delay-150"></div>
                  <div className="w-8 bg-blue-500 rounded-t-sm h-[70%] group-hover:h-[90%] transition-all duration-500 delay-200"></div>
                  <div className="w-8 bg-[#1a73e8] rounded-t-sm h-[90%] group-hover:h-[100%] transition-all duration-500 delay-300"></div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ALL-IN-ONE TOOLKIT */}
        <section className="py-24 bg-white text-[#202124] relative border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#202124]">Everything you need, in one place.</h2>
              <p className="text-[#5f6368] text-lg max-w-2xl mx-auto">SnapLink replaces your fragmented tools with one seamless, incredibly powerful dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Custom URLs</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Create short, trackable links with custom social media preview cards.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Bio Pages</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Build beautiful mobile landing pages for your Instagram or TikTok profile.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">File Sharing</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Share files securely with password protection and auto-expiry.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">3D vCards</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Design stunning interactive digital business cards for networking.</p>
              </div>
            </div>
          </div>
                </section>

        {/* API ACCESS SECTION */}
        <section className="py-16 bg-[#fafafc] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>
              
              <div className="flex-1 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  For Developers
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white">Developer API Access</h2>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Integrate SnapLink's powerful URL shortening and file sharing capabilities directly into your own applications. Generate links programmatically at scale.
                </p>
              </div>
              
              <div className="w-full md:w-auto relative z-10 flex flex-col items-center md:items-end bg-gray-800/50 p-6 sm:p-8 rounded-3xl border border-gray-700/50">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">₹199</span>
                  <span className="text-gray-400 font-medium">/ month</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 font-medium">No hidden fees. Cancel anytime.</p>
                
                <a href="/dashboard/api" className="w-full text-center bg-[#1a73e8] hover:bg-[#1557b0] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Purchase API Key
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
