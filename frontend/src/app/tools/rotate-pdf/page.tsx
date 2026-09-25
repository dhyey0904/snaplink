"use client";

import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import Link from 'next/link';

export default function RotatePDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<number>(90); // Default to 90 degrees clockwise
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Rotate all pages
      for (const page of pages) {
        // Get current rotation and add the new rotation
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err) {
      console.error(err);
      alert("Error rotating PDF. Ensure it is a valid, unprotected PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/tools" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs">Free Tool</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Rotate PDF</h1>
          <p className="text-lg text-gray-600">Rotate all pages in your PDF instantly. Processing is done securely in your browser.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select PDF File</label>
            <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-purple-600 font-bold flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {file.name}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Click or drag a PDF file here</div>
              )}
            </div>
          </div>
          
          <div className="mb-8 flex justify-center gap-4">
             <button 
                onClick={() => setRotation(270)} 
                className={`flex-1 py-4 px-6 rounded-xl font-bold border-2 transition-all flex flex-col items-center justify-center gap-2 ${rotation === 270 ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-gray-50'}`}
             >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                Rotate Left (-90°)
             </button>
             
             <button 
                onClick={() => setRotation(90)} 
                className={`flex-1 py-4 px-6 rounded-xl font-bold border-2 transition-all flex flex-col items-center justify-center gap-2 ${rotation === 90 ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-gray-50'}`}
             >
                <svg className="w-8 h-8 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                Rotate Right (90°)
             </button>
             
             <button 
                onClick={() => setRotation(180)} 
                className={`flex-1 py-4 px-6 rounded-xl font-bold border-2 transition-all flex flex-col items-center justify-center gap-2 ${rotation === 180 ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-gray-50'}`}
             >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Flip Upside Down (180°)
             </button>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-center">
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download={`rotated_${file?.name}`}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Rotated PDF
              </a>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className="px-8 py-4 bg-[#8b5cf6] hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Rotating...
                  </>
                ) : (
                  <>
                    Apply Rotation
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
