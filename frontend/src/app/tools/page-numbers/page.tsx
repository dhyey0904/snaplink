"use client";

import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Link from 'next/link';

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // Customization options
  const [position, setPosition] = useState<'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right'>('bottom-center');
  const [startPage, setStartPage] = useState(1);
  const [format, setFormat] = useState<'n' | 'n_of_m'>('n'); // n = "1", n_of_m = "1 of 5"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        
        // Calculate current logical page number
        const currentNumber = startPage + index;
        const text = format === 'n' ? `${currentNumber}` : `${currentNumber} of ${totalPages - 1 + startPage}`;
        
        const fontSize = 12;
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        const margin = 30; // 30 units from the edge
        
        let x = 0;
        let y = 0;
        
        // Y Position
        if (position.startsWith('bottom')) {
          y = margin;
        } else {
          y = height - margin - fontSize;
        }
        
        // X Position
        if (position.endsWith('left')) {
          x = margin;
        } else if (position.endsWith('right')) {
          x = width - margin - textWidth;
        } else {
          // center
          x = (width / 2) - (textWidth / 2);
        }
        
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err) {
      console.error(err);
      alert("Error processing PDF. Ensure it is a valid, unprotected PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/tools" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <span className="bg-teal-100 text-teal-700 font-bold px-3 py-1 rounded-full text-xs">Free Tool</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Add Page Numbers</h1>
          <p className="text-lg text-gray-600">Insert page numbers into your PDF documents with custom positioning.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select PDF File</label>
            <div className="border-2 border-dashed border-teal-300 rounded-2xl p-8 text-center hover:bg-teal-50 transition-colors cursor-pointer relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-teal-600 font-bold flex flex-col items-center justify-center gap-2">
                  <div className="w-16 h-16 bg-white rounded-xl shadow border border-teal-200 flex items-center justify-center text-teal-500 mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
                  </div>
                  {file.name}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Select a single PDF file</div>
              )}
            </div>
          </div>
          
          {file && (
            <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">2. Customization Options</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Position</label>
                  <select 
                    value={position} 
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Format</label>
                  <select 
                    value={format} 
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="n">Just Number (1, 2, 3)</option>
                    <option value="n_of_m">Page N of M (1 of 5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Starting Number</label>
                  <input 
                    type="number" 
                    value={startPage} 
                    onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-100 pt-8 flex justify-center">
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download={`numbered_${file?.name || 'document'}.pdf`}
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
                    Add Page Numbers
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
