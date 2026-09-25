"use client";

import React, { useState } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import Link from 'next/link';

export default function WatermarkPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.3);

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
      // Read the file as an array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Draw watermark on each page
      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Calculate font size relative to page width (e.g. 10% of width)
        const fontSize = Math.min(width, height) * 0.1;
        
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * fontSize) / 3.5, // approximate center
          y: height / 2 - fontSize / 2,
          size: fontSize,
          color: rgb(0.7, 0.7, 0.7), // Gray
          opacity: opacity,
          rotate: degrees(45),
        });
      }
      
      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      
      // Create a Blob and a URL for downloading
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err) {
      console.error(err);
      alert("Error processing PDF. Ensure it is a valid, unprotected PDF file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapLink</Link>
        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">SnapTools Free</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Add Watermark to PDF</h1>
          <p className="text-lg text-gray-600">Stamp an image or text over your PDF in seconds. 100% free and runs securely in your browser—no files uploaded to our servers.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select PDF File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-blue-600 font-bold flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {file.name}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Click or drag a PDF file here</div>
              )}
            </div>
          </div>
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">2. Watermark Text</label>
              <input 
                type="text" 
                value={watermarkText} 
                onChange={(e) => setWatermarkText(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                placeholder="e.g. CONFIDENTIAL"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Opacity: {Math.round(opacity * 100)}%</label>
              <input 
                type="range" 
                min="0.1" max="1" step="0.1" 
                value={opacity} 
                onChange={(e) => setOpacity(parseFloat(e.target.value))} 
                className="w-full mt-4"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-center">
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download={`watermarked_${file?.name}`}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
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
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    Apply Watermark
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
