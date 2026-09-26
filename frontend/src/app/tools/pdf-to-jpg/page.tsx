"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import Script from 'next/script';

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
      setProgress(0);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }
    
    // @ts-ignore
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) {
      alert("PDF library is still loading. Please try again in a second.");
      return;
    }
    
    // Set worker src
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    setIsProcessing(true);
    setProgress(10);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      const zip = new JSZip();
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        // Use a high scale for better JPG quality
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.9);
        });
        
        zip.file(`page_${i}.jpg`, blob);
        
        setProgress(10 + Math.floor((i / numPages) * 80));
      }
      
      setProgress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      setDownloadUrl(url);
      setProgress(100);
      
    } catch (err) {
      console.error(err);
      alert("Error processing PDF. Ensure it is a valid, unprotected PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" strategy="lazyOnload" />
      
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/tools" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-xs">Free Tool</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">PDF to JPG</h1>
          <p className="text-lg text-gray-600">Convert each page of your PDF into high-quality JPG images securely in your browser.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select PDF File</label>
            <div className="border-2 border-dashed border-yellow-300 rounded-2xl p-8 text-center hover:bg-yellow-50 transition-colors cursor-pointer relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-yellow-600 font-bold flex flex-col items-center justify-center gap-2">
                  <div className="w-16 h-16 bg-white rounded-xl shadow border border-yellow-200 flex items-center justify-center text-yellow-500 mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  {file.name}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Select a single PDF file to convert</div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col items-center">
            {isProcessing && (
              <div className="w-full max-w-xs mb-6">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                  <span>Converting...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
            
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download="converted_images.zip"
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download JPG ZIP
              </a>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className="px-8 py-4 bg-[#1a73e8] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Extracting Images...
                  </>
                ) : (
                  <>
                    Convert to JPG
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
