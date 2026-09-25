"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Link from 'next/link';

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setDownloadUrl(null);
    }
  };

  const handleProcess = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err) {
      console.error(err);
      alert("Error processing PDFs. Ensure all files are valid, unprotected PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/tools" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">Free Tool</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Merge PDF Files</h1>
          <p className="text-lg text-gray-600">Combine multiple PDFs into one unified document. Your files never leave your browser.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select PDFs (Hold Ctrl/Cmd to select multiple)</label>
            <div className="border-2 border-dashed border-red-300 rounded-2xl p-8 text-center hover:bg-red-50 transition-colors cursor-pointer relative">
              <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {files.length > 0 ? (
                <div className="text-red-600 font-bold flex flex-col items-center justify-center gap-2">
                  <div className="flex -space-x-4 mb-2">
                    {files.slice(0, 5).map((f, i) => (
                      <div key={i} className="w-12 h-12 bg-white rounded-lg shadow border border-red-200 flex items-center justify-center text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      </div>
                    ))}
                    {files.length > 5 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg shadow border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm z-10">
                        +{files.length - 5}
                      </div>
                    )}
                  </div>
                  {files.length} files selected
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Select PDF files to merge</div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-center">
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download="merged_document.pdf"
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Merged PDF
              </a>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={files.length < 2 || isProcessing}
                className="px-8 py-4 bg-[#1a73e8] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Merging...
                  </>
                ) : (
                  <>
                    Merge PDFs
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
