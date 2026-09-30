"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AdSidebar from '@/components/AdSidebar';
import AdBanner from '@/components/AdBanner';

type CompressionLevel = 'recommended' | 'extreme' | 'less' | 'target';

interface CompressedFile {
  id: string;
  originalFile: File;
  originalSize: number;
  status: 'pending' | 'compressing' | 'success' | 'error';
  compressedUrl?: string;
  compressedSize?: number;
  errorMsg?: string;
}

export default function CompressPDFPage() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [level, setLevel] = useState<CompressionLevel>('recommended');
  const [targetSizeKb, setTargetSizeKb] = useState<number>(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(true);

  useEffect(() => {
    // Render resets the free tier at exactly Midnight UTC on the 1st of the month.
    // That is October 1, 2026 at 00:00:00 UTC (5:30 AM IST).
    const renderResetTimeUTC = new Date('2026-10-01T00:00:00Z').getTime();
    
    // Automatically unlock the frontend without any network pings if the current time is past the reset time!
    if (Date.now() >= renderResetTimeUTC) {
      setIsServerOffline(false);
    }
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === 'application/pdf') {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) addFiles(pastedFiles);
  }, []);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (validFiles.length === 0) return;
    
    // Restrict to exactly one PDF at a time
    const singleFile = validFiles[0];
    const newItem: CompressedFile = {
      id: Math.random().toString(36).substring(7),
      originalFile: singleFile,
      originalSize: singleFile.size,
      status: 'pending'
    };
    
    // Overwrite the queue completely with the new file
    setFiles([newItem]);
  };

  const compressAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) return;
    for (const file of pendingFiles) {
      await compressFile(file.id);
    }
  };

  const compressFile = async (id: string) => {
    const fileObj = files.find(f => f.id === id);
    if (!fileObj) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'compressing', errorMsg: undefined } : f));

    try {
      const formData = new FormData();
      formData.append('file', fileObj.originalFile);
      formData.append('level', level);
      if (level === 'target') formData.append('targetSizeKb', targetSizeKb.toString());

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api`;
      const res = await fetch(`${apiUrl}/tools/compress-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Compression failed on the server');
      }

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'success',
        compressedUrl: downloadUrl,
        compressedSize: blob.size,
      } : f));
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', errorMsg: err.message } : f));
    }
  };

  const handleDownload = (file: CompressedFile) => {
    if (!file.compressedUrl) return;
    const a = document.createElement('a');
    a.href = file.compressedUrl;
    a.download = `compressed_${file.originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setFiles(prev => prev.filter(f => f.id !== file.id));
    }, 1000);
  };

  const totalSaved = files.reduce((acc, f) => acc + (f.originalSize - (f.compressedSize || f.originalSize)), 0);
  const isCompressing = files.some(f => f.status === 'compressing');
  const allDone = files.length > 0 && files.every(f => f.status === 'success' || f.status === 'error');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex gap-8 pt-8 pb-12 px-4 items-start justify-center">
        <main className="flex-grow max-w-3xl w-full">
              {isServerOffline && (
                <div className="mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center animate-pulse">
                  <div className="text-orange-600 mb-2 flex justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                  <h3 className="text-orange-800 font-bold text-xl mb-1">Server Upgrading (Back Today Morning)</h3>
                  <p className="text-orange-700 font-medium text-sm">We are currently waiting for our high-speed compute servers to reboot for the new month. This page will automatically unlock as soon as the server is online.</p>
                </div>
              )}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Compress PDF</h1>
            <p className="text-lg text-gray-600">Optimize and reduce PDF file structure size instantly securely.</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            
            {/* Settings Row */}
            <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Compression Level</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'recommended' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'recommended'} onChange={() => setLevel('recommended')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Recommended</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-6">Good compression, high quality</span>
                </label>
                
                <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'extreme' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'extreme'} onChange={() => setLevel('extreme')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Extreme</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-6">Max compression, lower quality</span>
                </label>

                <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'less' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'less'} onChange={() => setLevel('less')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Less</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-6">Minor compression, perfect quality</span>
                </label>
                <label className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${level === 'target' ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={level === 'target'} onChange={() => setLevel('target')} className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">Target Size</span>
                  </div>
                  {level === 'target' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" min="10" value={targetSizeKb} onChange={(e) => setTargetSizeKb(Number(e.target.value))} className="w-full border border-green-300 rounded p-1 text-sm outline-none bg-white" />
                      <span className="text-xs font-bold text-gray-500">KB</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 ml-6">Specify exact size</span>
                  )}
                </label>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Select PDF Files</label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer relative ${isServerOffline ? 'bg-gray-50 pointer-events-none cursor-not-allowed' : ''} ${isDragging ? 'border-green-500 bg-green-50' : 'border-green-300 hover:bg-green-50'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <input type="file" disabled={isServerOffline} ref={fileInputRef} accept="application/pdf" onChange={(e) => { if(e.target.files) addFiles(Array.from(e.target.files)); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">Click to browse or drop PDF files</h3>
                  <p className="text-gray-700 text-sm font-medium">Supports standard PDF documents</p>
                </div>
              </div>
            </div>

            {/* Queue List */}
            {files.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Ready to Compress</h3>
                  {totalSaved > 0 && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">Saved: {formatSize(totalSaved)}</span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded flex items-center justify-center border border-red-100 shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-sm text-gray-900 truncate" title={file.originalFile.name}>{file.originalFile.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{formatSize(file.originalSize)}</span>
                          {file.compressedSize && (
                            <>
                              <span> &rarr; </span>
                              <span className="text-green-600 font-bold">{formatSize(file.compressedSize)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {file.status === 'error' && <span className="text-xs text-red-500 font-bold" title={file.errorMsg}>Error</span>}
                        {file.status === 'compressing' && <span className="text-xs text-green-600 font-bold animate-pulse">Processing...</span>}
                        {file.status === 'success' && file.compressedUrl && (
                          <button onClick={() => handleDownload(file)} className="text-green-600 hover:text-green-700 bg-green-50 p-2 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          </button>
                        )}
                        <button onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))} className="text-gray-400 hover:text-red-500 p-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setFiles([])} className="text-sm font-bold text-gray-500 hover:text-red-500">Clear</button>
                  {!allDone && (
                    <button onClick={compressAll} disabled={isCompressing} className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${isCompressing ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/30'}`}>
                      {isCompressing ? 'Compressing...' : 'Compress PDF'}
                    </button>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
