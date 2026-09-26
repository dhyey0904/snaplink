"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Link from 'next/link';

export default function ImageToPDFPage() {
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
    if (files.length === 0) {
      alert("Please select at least 1 image to convert.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          alert(`Unsupported image format for ${file.name}. Only JPG and PNG are supported.`);
          continue;
        }

        const { width, height } = image.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err) {
      console.error(err);
      alert("Error processing images. Ensure all files are valid JPG or PNG images.");
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
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Image to PDF</h1>
          <p className="text-lg text-gray-600">Convert JPG and PNG images into a PDF document instantly in your browser.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select Images (JPG, PNG)</label>
            <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center hover:bg-emerald-50 transition-colors cursor-pointer relative">
              <input type="file" multiple accept="image/jpeg, image/png" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {files.length > 0 ? (
                <div className="text-emerald-600 font-bold flex flex-col items-center justify-center gap-2">
                  <div className="flex -space-x-4 mb-2">
                    {files.slice(0, 5).map((f, i) => (
                      <div key={i} className="w-12 h-12 bg-white rounded-lg shadow border border-emerald-200 flex items-center justify-center text-emerald-500 overflow-hidden">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    ))}
                    {files.length > 5 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg shadow border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm z-10">
                        +{files.length - 5}
                      </div>
                    )}
                  </div>
                  {files.length} image{files.length !== 1 ? 's' : ''} selected
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Select image files to convert</div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-center">
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download="converted_images.pdf"
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
              </a>
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
                    Convert to PDF
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
