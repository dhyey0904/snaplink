"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { decryptPDF } from 'cryptpdf';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AdSidebar from '@/components/AdSidebar';
import AdBanner from '@/components/AdBanner';

export default function UnlockPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
      setErrorMsg(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setErrorMsg(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      let decryptedBytes: Uint8Array;
      
      let cryptErr = '';
      try {
        decryptedBytes = await decryptPDF(pdfBytes, password.normalize("NFC"));
      } catch (err: any) {
        cryptErr = err.message || "Unknown cryptpdf error";
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password.normalize("NFC") } as any);
          decryptedBytes = await pdfDoc.save();
        } catch (err2: any) {
          throw new Error(`CRITICAL_FAIL: cryptpdf[${cryptErr}] pdf-lib[${err2.message}]`);
        }
      }
      
      const blob = new Blob([decryptedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("CRITICAL_FAIL")) {
         setErrorMsg(`Tech Error: ${err.message}`);
      } else if (err.message?.includes("Invalid password") || err.message?.includes("encrypted")) {
         setErrorMsg("Incorrect password. Please enter the correct password to unlock this PDF.");
      } else {
         setErrorMsg(`Error processing PDF: ${err.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <Navbar />
      
            <div className="max-w-7xl mx-auto flex gap-4 md:p-4 md:p-8 pt-8 pb-12 px-4 items-start justify-center">
        {/* Left Ad */}
        <div className="hidden xl:block w-[300px] shrink-0">
          <AdSidebar />
        </div>
        
        <main className="flex-grow max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Unlock PDF</h1>
          <p className="text-lg text-gray-600">Remove password security from your PDF. You must know the current password to unlock it.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 md:p-5 md:p-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">1. Select Locked PDF File</label>
            <div className="border-2 border-dashed border-pink-300 rounded-2xl p-4 md:p-4 md:p-8 text-center hover:bg-pink-50 transition-colors cursor-pointer relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-pink-600 font-bold flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  {file.name}
                </div>
              ) : (
                <div className="text-gray-500 font-medium">Click or drag a locked PDF file here</div>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">2. Enter Current Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                autoComplete="off" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 font-medium text-gray-900"
                placeholder="Enter password..."
                disabled={!file}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                )}
              </button>
            </div>
            {errorMsg && (
              <p className="text-red-600 text-sm font-bold mt-2 bg-red-50 p-2 rounded-lg">{errorMsg}</p>
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-center">
            {downloadUrl ? (
              <a 
                href={downloadUrl} 
                download={`unlocked_${file?.name}`}
                className="px-4 md:px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                Download Unlocked PDF
              </a>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={!file || !password || isProcessing}
                className="px-4 md:px-8 py-4 bg-[#ec4899] hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Unlocking...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                    Unlock PDF
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <AdBanner />
        </main>
        
        {/* Right Ad */}
        <div className="hidden xl:block w-[300px] shrink-0">
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}





