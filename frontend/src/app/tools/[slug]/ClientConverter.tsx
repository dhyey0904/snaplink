"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ClientConverterProps {
  from: string;
  to: string;
  slug: string;
}

const MIME_MAP: Record<string, string> = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp',
  'bmp': 'image/bmp',
  'svg': 'image/svg+xml',
  'avif': 'image/avif',
  'gif': 'image/gif'
};

export default function ClientConverter({ from, to, slug }: ClientConverterProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<{name: string, url: string}[]>([]);

  const fromMime = MIME_MAP[from] || `image/${from}`;
  const toMime = MIME_MAP[to] || `image/${to}`;
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setDownloadUrls([]);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    const results: {name: string, url: string}[] = [];
    
    try {
      for (const file of files) {
        // Create an Image object from the file
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });
        
        // Create a canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error("Could not get canvas context");
        
        // If converting to JPG, fill with white background first (since JPG doesn't support transparency)
        if (to === 'jpg' || to === 'jpeg') {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Convert to Blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas toBlob failed"));
          }, toMime, 0.92);
        });
        
        // Create download URL
        const originalName = file.name.split('.').slice(0, -1).join('.');
        const newName = `${originalName}_converted.${to}`;
        const downloadUrl = URL.createObjectURL(blob);
        
        results.push({ name: newName, url: downloadUrl });
        URL.revokeObjectURL(objectUrl);
      }
      
      setDownloadUrls(results);
    } catch (err) {
      console.error(err);
      alert(`Error converting images. Ensure your browser supports ${fromUpper} and ${toUpper}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/tools" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs">Free Tool</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{fromUpper} to {toUpper}</h1>
          <p className="text-lg text-gray-600">Convert {fromUpper} images to {toUpper} format instantly and securely in your browser.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select {fromUpper} File(s)</label>
            <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer relative">
              <input type="file" accept={fromMime} multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {files.length > 0 ? (
                <div className="text-purple-600 font-bold flex flex-col items-center justify-center gap-2">
                  <div className="flex -space-x-4 mb-2">
                    {files.slice(0, 5).map((f, i) => (
                      <div key={i} className="w-12 h-12 bg-white rounded-lg shadow border border-purple-200 flex items-center justify-center text-purple-500 overflow-hidden text-xs">
                        {fromUpper}
                      </div>
                    ))}
                    {files.length > 5 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg shadow border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm z-10">
                        +{files.length - 5}
                      </div>
                    )}
                  </div>
                  {files.length} file(s) selected
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Select {fromUpper} images to convert</div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col items-center">
            {downloadUrls.length > 0 ? (
              <div className="flex flex-col gap-3 w-full max-w-md">
                <h3 className="text-center font-bold text-gray-700 mb-2">Conversion Complete!</h3>
                {downloadUrls.map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.url} 
                    download={item.name}
                    className="w-full py-3 px-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold rounded-xl transition-all flex items-center justify-between"
                  >
                    <span className="truncate mr-4 text-sm">{item.name}</span>
                    <span className="shrink-0 bg-green-500 text-white p-1.5 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </span>
                  </a>
                ))}
                <button 
                  onClick={() => { setFiles([]); setDownloadUrls([]); }}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-800 underline"
                >
                  Convert more files
                </button>
              </div>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={files.length === 0 || isProcessing}
                className="px-8 py-4 bg-[#1a73e8] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    Convert to {toUpper}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
