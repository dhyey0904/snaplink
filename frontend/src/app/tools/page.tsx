import React from 'react';
import Link from 'next/link';

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
  // PDF Utilities
  { category: 'PDF Utilities', id: 'merge', name: 'Merge PDF', desc: 'Combine multiple PDFs into one unified document.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'bg-red-500', href: '/tools/merge-pdf' },
  { category: 'PDF Utilities', id: 'split', name: 'Split PDF', desc: 'Extract pages from your PDF or save each page as a separate PDF.', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-orange-500', href: '/tools/split-pdf' }, 
  { category: 'PDF Utilities', id: 'compress', name: 'Compress PDF', desc: 'Reduce file size while optimizing for maximal PDF quality.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', color: 'bg-green-500', href: '/tools/compress-pdf' },
  { category: 'PDF Utilities', id: 'rotate', name: 'Rotate PDF', desc: 'Rotate your PDFs the way you need them.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'bg-purple-500', href: '/tools/rotate-pdf' },
  { category: 'PDF Utilities', id: 'numbers', name: 'Page Numbers', desc: 'Add page numbers into PDFs with ease.', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', color: 'bg-teal-500', href: '/tools/page-numbers' },
  { category: 'PDF Utilities', id: 'watermark', name: 'Watermark PDF', desc: 'Stamp an image or text over your PDF in seconds.', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'bg-gray-800', href: '/tools/watermark-pdf' },
  
  // PDF Security
  { category: 'PDF Security', id: 'unlock', name: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs.', icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z', color: 'bg-pink-500', href: '/tools/unlock-pdf' },
  { category: 'PDF Security', id: 'protect', name: 'Protect PDF', desc: 'Encrypt your PDF with a password to keep sensitive data confidential.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'bg-indigo-500', href: '/tools/protect-pdf' },
  
  // Convert to PDF
  { category: 'Convert to PDF', id: 'img2pdf', name: 'Image to PDF', desc: 'Convert JPG and PNG images into a PDF document.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-emerald-500', href: '/tools/image-to-pdf' },
  { category: 'Convert to PDF', id: 'word-to-pdf', name: 'Word to PDF', desc: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-blue-600', href: '#', pro: true },
  
  // Convert from PDF
  { category: 'Convert from PDF', id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Extract all images contained in a PDF or convert each page to a JPG.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-yellow-500', href: '/tools/pdf-to-jpg' },
  { category: 'Convert from PDF', id: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert your PDF to an editable Word document (DOCX).', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-blue-600', href: '#', pro: true },

  // Image Converters
  { category: 'Image Converters', id: 'jpg-to-png', name: 'JPG to PNG', desc: 'Convert JPG images to transparent PNGs instantly.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-purple-500', href: '/tools/jpg-to-png' },
  { category: 'Image Converters', id: 'png-to-jpg', name: 'PNG to JPG', desc: 'Convert PNG images to JPG format for smaller file sizes.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-indigo-500', href: '/tools/png-to-jpg' },
  { category: 'Image Converters', id: 'jpg-to-webp', name: 'JPG to WEBP', desc: 'Convert JPG images to the modern WEBP format.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-blue-500', href: '/tools/jpg-to-webp' },
  { category: 'Image Converters', id: 'png-to-webp', name: 'PNG to WEBP', desc: 'Convert PNG images to highly optimized WEBP files.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-cyan-500', href: '/tools/png-to-webp' },
  { category: 'Image Converters', id: 'webp-to-jpg', name: 'WEBP to JPG', desc: 'Convert WEBP files back to universally supported JPGs.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-sky-500', href: '/tools/webp-to-jpg' },
  { category: 'Image Converters', id: 'webp-to-png', name: 'WEBP to PNG', desc: 'Convert WEBP files to high-quality transparent PNGs.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-emerald-500', href: '/tools/webp-to-png' },
  { category: 'Image Converters', id: 'bmp-to-jpg', name: 'BMP to JPG', desc: 'Convert large BMP files into compressed JPG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-amber-500', href: '/tools/bmp-to-jpg' },
  { category: 'Image Converters', id: 'bmp-to-png', name: 'BMP to PNG', desc: 'Convert large BMP files into standard PNG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-orange-500', href: '/tools/bmp-to-png' },
  { category: 'Image Converters', id: 'svg-to-png', name: 'SVG to PNG', desc: 'Convert vector SVG graphics into raster PNG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-fuchsia-500', href: '/tools/svg-to-png' },
  { category: 'Image Converters', id: 'svg-to-jpg', name: 'SVG to JPG', desc: 'Convert vector SVG graphics into raster JPG images.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-pink-500', href: '/tools/svg-to-jpg' },
  { category: 'Image Converters', id: 'avif-to-jpg', name: 'AVIF to JPG', desc: 'Convert modern AVIF images back to standard JPG format.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-rose-500', href: '/tools/avif-to-jpg' },
  { category: 'Image Converters', id: 'avif-to-png', name: 'AVIF to PNG', desc: 'Convert modern AVIF images into transparent PNGs.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-red-500', href: '/tools/avif-to-png' },
  { category: 'Image Converters', id: 'gif-to-png', name: 'GIF to PNG', desc: 'Extract the first frame of a GIF animation into a PNG image.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-violet-500', href: '/tools/gif-to-png' },
];

export default function ToolsHubPage() {
  const categories = Array.from(new Set(tools.map(t => t.category)));

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
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Every tool you need in one place</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium">All our tools are 100% FREE, fast, and completely private. We never store your files on our servers.</p>
      </div>

      {/* Tools Grouped By Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10 space-y-16">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tools.filter(t => t.category === category).map((tool) => (
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
        ))}
      </div>
    </div>
  );
}
