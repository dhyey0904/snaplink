"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Link from 'next/link';

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setDownloadUrl(null);
      
      // Quickly parse the PDF to get total pages
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
      } catch (err) {
        setTotalPages(0);
      }
    }
  };

  const parsePageRange = (range: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = range.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n));
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, end));
          const e = Math.min(maxPages, Math.max(start, end));
          for (let i = s; i <= e; i++) pages.add(i - 1); // 0-indexed
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const maxPages = pdfDoc.getPageCount();
      
      let indicesToExtract: number[] = [];
      
      if (pageRange.trim() === "") {
        // If empty, extract all pages
        indicesToExtract = Array.from({ length: maxPages }, (_, i) => i);
      } else {
        indicesToExtract = parsePageRange(pageRange, maxPages);
      }
      
      if (indicesToExtract.length === 0) {
        alert("Invalid page range specified.");
        setIsProcessing(false);
        return;
      }
      
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, indicesToExtract);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <Link href="/tools" className="font-black text-2xl tracking-tighter text-[#1a73e8]">SnapTools</Link>
        <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs">Free Tool</span>
      </header>
      
      <main className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Split & Extract PDF Pages</h1>
          <p className="text-lg text-gray-600">Extract specific pages from your PDF to create a new document instantly in your browser.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select PDF File</label>
            <div className="border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center hover:bg-orange-50 transition-colors cursor-pointer relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-orange-600 font-bold flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {file.name} {totalPages > 0 && `(${totalPages} pages)`}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Click or drag a PDF file here</div>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">2. Pages to Extract</label>
            <input 
              type="text" 
              value={pageRange} 
              onChange={(e) => setPageRange(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 font-medium text-gray-900"
              placeholder="e.g. 1-5, 8, 11-13 (Leave blank to extract all)"
              disabled={!file}
            />
            <p className="text-xs text-gray-500 mt-2">Enter page numbers and/or page ranges separated by commas.</p>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-center">
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download={`extracted_${file?.name}`}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download New PDF
              </a>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className="px-8 py-4 bg-[#f97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Extracting...
                  </>
                ) : (
                  <>
                    Split PDF
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
