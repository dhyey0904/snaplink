import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Free PDF Tools & Document Converters | SnapTools',
  description: 'Merge, split, compress, watermark, and convert PDF documents for free. 100% browser-based and secure.',
};

const tools = [
  { id: 'merge', name: 'Merge PDF', desc: 'Combine multiple PDFs into one unified document.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'bg-red-500', href: '/tools/merge-pdf' },
  { id: 'split', name: 'Split PDF', desc: 'Extract pages from your PDF or save each page as a separate PDF.', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-orange-500', href: '/tools/split-pdf' },
  { id: 'compress', name: 'Compress PDF', desc: 'Reduce file size while optimizing for maximal PDF quality.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', color: 'bg-green-500', href: '/tools/compress-pdf' },
  { id: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert your PDF to an editable Word document (DOCX).', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-blue-600', href: '#', pro: true },
  { id: 'word-to-pdf', name: 'Word to PDF', desc: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-blue-600', href: '#', pro: true },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Extract all images contained in a PDF or convert each page to a JPG.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-yellow-500', href: '/tools/pdf-to-jpg' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-yellow-500', href: '/tools/jpg-to-pdf' },
  { id: 'watermark', name: 'Watermark PDF', desc: 'Stamp an image or text over your PDF in seconds.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'bg-gray-800', href: '/tools/watermark-pdf' },
  { id: 'rotate', name: 'Rotate PDF', desc: 'Rotate your PDFs the way you need them.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'bg-purple-500', href: '/tools/rotate-pdf' },
  { id: 'unlock', name: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs.', icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z', color: 'bg-pink-500', href: '/tools/unlock-pdf' },
  { id: 'protect', name: 'Protect PDF', desc: 'Encrypt your PDF with a password to keep sensitive data confidential.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'bg-indigo-500', href: '#', pro: true },
  { id: 'numbers', name: 'Page Numbers', desc: 'Add page numbers into PDFs with ease.', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', color: 'bg-teal-500', href: '/tools/page-numbers' },
];

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-8 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 font-semibold hover:text-gray-900 transition-colors">Log in</Link>
          <Link href="/register" className="bg-[#1a73e8] hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-md transition-all">Sign up</Link>
        </div>
      </header>
      
      {/* Hero */}
      <div className="bg-[#1a73e8] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Every tool you need to work with PDFs in one place</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium">Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.</p>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.id} 
              href={tool.href}
              className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group ${tool.pro ? 'opacity-80' : 'hover:-translate-y-1'}`}
              title={tool.pro ? 'Backend currently undergoing maintenance. Check back Oct 1st.' : ''}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${tool.color} group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tool.icon}></path>
                  </svg>
                </div>
                {tool.pro && (
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">Oct 1st</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
