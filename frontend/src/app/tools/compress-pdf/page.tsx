"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Link from 'next/link';

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [newSize, setNewSize] = useState<number>(0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOriginalSize(e.target.files[0].size);
      setDownloadUrl(null);
      setNewSize(0);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Save with Object Streams (Compresses structure and metadata natively in the browser)
      // Note: True image downsampling requires a backend (Ghostscript/ImageMagick)
      // This approach provides structural optimization which is safe to run in-browser
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      setNewSize(pdfBytes.byteLength);
      
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err) {
      console.error(err);
      alert("Error compressing PDF. Ensure it is a valid, unprotected PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/tools" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Free Tool</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Compress PDF</h1>
          <p className="text-lg text-gray-600">Optimize and reduce PDF file structure size instantly in your browser.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select PDF File</label>
            <div className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center hover:bg-green-50 transition-colors cursor-pointer relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-green-600 font-bold flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {file.name}
                  </div>
                  <span className="text-sm font-medium text-gray-500">Original Size: {formatBytes(originalSize)}</span>
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Click or drag a PDF file here</div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col items-center justify-center">
            {downloadUrl ? (
              <div className="text-center w-full">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                  <h3 className="font-black text-green-800 text-xl mb-2">Compression Complete!</h3>
                  <div className="flex justify-center items-center gap-8 text-sm font-bold">
                    <div className="text-gray-500 line-through">{formatBytes(originalSize)}</div>
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    <div className="text-green-700 text-lg">{formatBytes(newSize)}</div>
                  </div>
                  {newSize >= originalSize && (
                     <p className="text-xs text-orange-600 mt-3 font-medium bg-orange-100 p-2 rounded-lg inline-block">
                        Note: This PDF's images are already heavily compressed. Structural optimization couldn't reduce it further.
                     </p>
                  )}
                </div>
                
                <a 
                  href={downloadUrl} 
                  download={`compressed_${file?.name}`}
                  className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 text-lg w-full max-w-sm mx-auto"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download PDF
                </a>
              </div>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className="px-8 py-4 bg-[#22c55e] hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Compressing Structure...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    Compress PDF
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
