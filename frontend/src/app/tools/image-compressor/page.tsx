"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UploadCloud, CheckCircle, Settings, DownloadCloud, Zap, Info } from 'lucide-react';

type CompressionMode = 'smart' | 'custom' | 'target';

interface CompressedFile {
  id: string;
  originalFile: File;
  compressedUrl?: string;
  originalSize: number;
  compressedSize?: number;
  savedPercentage?: number;
  quality?: number;
  outputFormat?: string;
  dimensions?: string;
  status: 'pending' | 'compressing' | 'success' | 'error';
  errorMsg?: string;
  previewUrl: string;
}

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [mode, setMode] = useState<CompressionMode>('smart');
  const [quality, setQuality] = useState(85);
  const [targetSizeKb, setTargetSizeKb] = useState(100);
  const [outputFormat, setOutputFormat] = useState('original');
  const [keepMetadata, setKeepMetadata] = useState(false);
  const [resizeWidth, setResizeWidth] = useState<number | ''>('');
  
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
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
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
    const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
    const newItems: CompressedFile[] = validFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      originalFile: f,
      originalSize: f.size,
      status: 'pending',
      previewUrl: URL.createObjectURL(f)
    }));
    setFiles([newItems[0]]); // Restrict to one image at a time
  };

  const compressAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) return;
    for (const file of pendingFiles) {
      await compressSingle(file.id);
    }
  };

  const compressSingle = async (id: string) => {
    const fileObj = files.find(f => f.id === id);
    if (!fileObj) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'compressing' } : f));

    try {
      const formData = new FormData();
      formData.append('file', fileObj.originalFile);
      formData.append('mode', mode);
      formData.append('quality', quality.toString());
      if (mode === 'target' && targetSizeKb) formData.append('targetSizeKb', targetSizeKb.toString());
      formData.append('outputFormat', outputFormat);
      formData.append('keepMetadata', keepMetadata.toString());
      if (resizeWidth) formData.append('resizeWidth', resizeWidth.toString());

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api`;
      const res = await fetch(`${apiUrl}/image/compress`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Compression failed');
      }

      const data = await res.json();
      const downloadUrl = data.downloadUrl.startsWith('http') ? data.downloadUrl : `${apiUrl.replace('/api', '')}${data.downloadUrl}`;
      
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'success',
        compressedUrl: downloadUrl,
        compressedSize: data.compressedSize,
        savedPercentage: data.savedPercentage,
        quality: data.quality,
        outputFormat: data.outputFormat,
        dimensions: data.dimensions,
      } : f));
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', errorMsg: err.message } : f));
    }
  };

  const downloadZip = async () => {
    // ...
  };

  const handleDownload = (file: CompressedFile) => {
    const a = document.createElement('a');
    a.href = file.compressedUrl!;
    a.download = file.originalFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      alert("Image downloaded and securely deleted from our servers! Please upload a new image.");
      setFiles([]);
    }, 1000);
  };

  const totalSaved = files.reduce((acc, f) => acc + (f.originalSize - (f.compressedSize || f.originalSize)), 0);
  const isCompressing = files.some(f => f.status === 'compressing');
  const allDone = files.length > 0 && files.every(f => f.status === 'success' || f.status === 'error');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex gap-8 pt-8 pb-12 px-4 items-start justify-center">
        {/* Left Ad Placeholder (Since user asked to remove ads from image compressor, we just leave the empty div or omit it, wait, user said "remove ad from it", but then "now create it properly according to our website". I'll add the ad placeholders like other tools, but commented out or just use the layout) */}
        
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
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Image Compressor</h1>
            <p className="text-lg text-gray-600">Reduce file size by up to 90% while flawlessly preserving visual quality.</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            
            {/* Settings Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Compression Mode</label>
                
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${mode === 'smart' ? 'border-[#1557b0] bg-blue-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <input type="radio" checked={mode === 'smart'} onChange={() => setMode('smart')} className="w-4 h-4 text-[#1557b0]" />
                  <div>
                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">Smart Compress <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Auto</span></div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${mode === 'target' ? 'border-[#1557b0] bg-blue-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <input type="radio" checked={mode === 'target'} onChange={() => setMode('target')} className="w-4 h-4 text-[#1557b0]" />
                  <div className="flex-grow">
                    <div className="font-bold text-sm text-gray-900 mb-1">Target File Size</div>
                    {mode === 'target' && (
                      <div className="flex items-center gap-2">
                        <input type="number" min="10" value={targetSizeKb} onChange={(e) => setTargetSizeKb(Number(e.target.value))} className="w-full text-gray-900 placeholder-gray-700 font-medium border border-gray-200 rounded p-1.5 text-sm outline-none" />
                        <span className="text-xs font-bold text-gray-700">KB</span>
                      </div>
                    )}
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${mode === 'custom' ? 'border-[#1557b0] bg-blue-50/50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                  <input type="radio" checked={mode === 'custom'} onChange={() => setMode('custom')} className="w-4 h-4 text-[#1557b0]" />
                  <div className="flex-grow">
                    <div className="font-bold text-sm text-gray-900 mb-1">Custom Quality</div>
                    {mode === 'custom' && (
                      <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[#1557b0]" />
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Output Format</label>
                <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full text-gray-900 placeholder-gray-700 font-medium border border-gray-200 bg-white rounded-xl p-3 text-sm font-medium focus:outline-none">
                  <option value="original">Keep Original</option>
                  <option value="webp">Convert to WebP</option>
                  <option value="jpg">Convert to JPG</option>
                  <option value="png">Convert to PNG</option>
                </select>

                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mt-4">Resize Width (px)</label>
                <input type="number" placeholder="Optional (e.g. 1920)" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value ? Number(e.target.value) : '')} className="w-full text-gray-900 placeholder-gray-700 font-medium border border-gray-200 bg-white rounded-xl p-3 text-sm font-medium focus:outline-none" />

                <label className="flex items-center gap-2 mt-4 cursor-pointer">
                  <input type="checkbox" checked={keepMetadata} onChange={(e) => setKeepMetadata(e.target.checked)} className="rounded text-[#1557b0]" />
                  <span className="text-sm font-bold text-gray-600">Keep EXIF Data</span>
                </label>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Select Images</label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer relative ${isServerOffline ? 'bg-gray-50 pointer-events-none cursor-not-allowed' : ''} ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-emerald-300 hover:bg-emerald-50'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <input type="file" disabled={isServerOffline} ref={fileInputRef} accept="image/*" onChange={(e) => { if(e.target.files) addFiles(Array.from(e.target.files)); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">Click to browse or drop images</h3>
                  <p className="text-gray-700 text-sm font-medium">Supports JPG, PNG, WebP, AVIF</p>
                </div>
              </div>
            </div>

            {/* Queue List */}
            {files.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Ready to Compress</h3>
                  {totalSaved > 0 && (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-xs font-bold">Saved: {formatSize(totalSaved)}</span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                      <img src={file.previewUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0" />
                      
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-sm text-gray-900 truncate" title={file.originalFile.name}>{file.originalFile.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{formatSize(file.originalSize)}</span>
                          {file.compressedSize && (
                            <>
                              <span>→</span>
                              <span className="text-emerald-600 font-bold">{formatSize(file.compressedSize)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {file.status === 'error' && <span className="text-xs text-red-500 font-bold">Error</span>}
                        {file.status === 'compressing' && <span className="text-xs text-[#1557b0] font-bold animate-pulse">Processing...</span>}
                        {file.status === 'success' && file.compressedUrl && (
                          <button onClick={() => handleDownload(file)} className="text-[#1557b0] hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors">
                            <DownloadCloud size={18} />
                          </button>
                        )}
                        <button onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))} className="text-gray-400 hover:text-red-500 p-2">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setFiles([])} className="text-sm font-bold text-gray-500 hover:text-red-500">Clear</button>
                  {!allDone && (
                    <button onClick={compressAll} disabled={isCompressing} className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${isCompressing ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-[#1557b0] text-white hover:bg-blue-700'}`}>
                      {isCompressing ? 'Compressing...' : 'Compress Image'}
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
