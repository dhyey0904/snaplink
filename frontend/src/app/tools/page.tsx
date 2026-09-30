import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Snap Tools | Free PDF Tools, Document Converters & Web Utilities',
  description: 'Access Snap Tools to merge, split, compress, watermark, and convert PDF documents for free. 100% browser-based and secure.',
  keywords: ["Snap Tools", "free PDF tools", "PDF compressor", "merge PDF", "split PDF", "web utilities"],
  alternates: {
    canonical: "https://www.snaplinks.in/tools",
  },
  openGraph: {
    title: 'Snap Tools | Free PDF & Web Utilities',
    description: 'Merge, split, compress, watermark, and convert PDF documents for free instantly in your browser.',
    url: 'https://www.snaplinks.in/tools',
  }
};

const tools = [
  // Top Priority / Most Used
  { category: 'PDF Utilities', id: 'merge', name: 'Merge PDF', desc: 'Combine multiple PDFs into one unified document.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'bg-red-500', href: '/tools/merge-pdf' },
  { category: 'PDF Utilities', id: 'split', name: 'Split PDF', desc: 'Extract pages from your PDF or save each page as a separate PDF.', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-orange-500', href: '/tools/split-pdf' }, 
  { category: 'PDF Utilities', id: 'compress', name: 'Compress PDF', desc: 'Reduce file size while optimizing for maximal PDF quality.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', color: 'bg-green-500', href: '/tools/compress-pdf', requiresServer: true },
  
  // High Priority Converters
  
  
  
  
  
  // Security Tools
  { category: 'PDF Security', id: 'unlock', name: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs.', icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z', color: 'bg-pink-500', href: '/tools/unlock-pdf' },
  { category: 'PDF Security', id: 'protect', name: 'Protect PDF', desc: 'Encrypt your PDF with a password to keep sensitive data confidential.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'bg-indigo-500', href: '/tools/protect-pdf' },
  
  // Lower Priority Utilities
  { category: 'PDF Utilities', id: 'rotate', name: 'Rotate PDF', desc: 'Rotate your PDFs the way you need them.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'bg-purple-500', href: '/tools/rotate-pdf' },
  { category: 'PDF Utilities', id: 'watermark', name: 'Watermark PDF', desc: 'Stamp an image or text over your PDF in seconds.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'bg-gray-800', href: '/tools/watermark-pdf' },
  { category: 'PDF Utilities', id: 'numbers', name: 'Page Numbers', desc: 'Add page numbers into PDFs with ease.', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', color: 'bg-teal-500', href: '/tools/page-numbers' },

  // Image Converters
  
  
  
  
  
  
  
  
  
  
  
  
  
];

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col">
      <Navbar />
      
      {/* Hero */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 pt-12 pb-20 px-4 text-center z-10 w-full">
        {/* Ambient background glows - Full Width */}
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-[#1a73e8]/15 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm font-bold tracking-wide mb-6 text-[#1a73e8] shadow-sm relative">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 100% Free Forever
        </div>
        
        <h1 className="text-5xl md:text-[56px] font-black tracking-tight mb-7 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] via-purple-600 to-[#1a73e8] animate-text-shimmer bg-[length:200%_auto]">The ultimate toolkit</span> <br className="hidden sm:block" />
          <span className="text-gray-900">for PDFs and Images</span>
        </h1>
        
        <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
          SnapTools gives you everything you need in one unified space. Compress, merge, and split PDFs, or instantly convert modern images like AVIF and WebP. Blazingly fast, and completely private.
        </p>
      </div>

      {/* Massive Single Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-0 flex-grow w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {tools.map((tool) => (
            <Link 
              key={tool.id} 
              href={tool.href}
              className={`bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#1a73e8]/30 flex flex-col items-center text-center group min-h-[220px] ${tool.requiresServer ? 'opacity-95' : ''}`}
              title={tool.requiresServer ? 'Backend currently undergoing maintenance. Available Oct 2nd.' : ''}
            >
              <div className="mb-5 relative w-[68px] h-[68px] rounded-2xl bg-blue-50 text-[#1a73e8] flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 group-hover:shadow-md transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tool.icon}></path>
                </svg>
                {tool.requiresServer && (
                  <span className="absolute -top-2 -right-6 bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">Oct 2</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2.5 leading-tight group-hover:text-[#1a73e8] transition-colors">{tool.name}</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed font-medium">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
