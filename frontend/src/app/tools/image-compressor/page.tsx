"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import AdSidebar from '@/components/AdSidebar';
import AdBanner from '@/components/AdBanner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UploadCloud, CheckCircle, Settings, Sliders, FileImage, DownloadCloud, Image as ImageIcon, Copy, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  compressionTimeMs?: number;
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
    setFiles(prev => [...prev, ...newItems]);
  };

  const compressAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) return;

    // Process files sequentially (or you could batch them in parallel)
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
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
        compressionTimeMs: data.compressionTimeMs
      } : f));
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', errorMsg: err.message } : f));
    }
  };

  const downloadZip = async () => {
    const successFiles = files.filter(f => f.status === 'success' && f.compressedUrl);
    if (successFiles.length === 0) return;
    
    const zip = new JSZip();
    
    for (const f of successFiles) {
      try {
        const response = await fetch(f.compressedUrl!);
        const blob = await response.blob();
        let filename = f.originalFile.name;
        
        // Adjust extension if format changed
        if (f.outputFormat) {
          const ext = f.outputFormat.toLowerCase() === 'jpeg' ? 'jpg' : f.outputFormat.toLowerCase();
          const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
          filename = `${nameWithoutExt}.${ext}`;
        }
        
        zip.file(filename, blob);
      } catch (err) {
        console.error("Failed to fetch image for zip", err);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'SnapLinks_Compressed_Images.zip');
  };

  const totalSaved = files.reduce((acc, f) => acc + (f.originalSize - (f.compressedSize || f.originalSize)), 0);
  const isCompressing = files.some(f => f.status === 'compressing');
  const allDone = files.length > 0 && files.every(f => f.status === 'success' || f.status === 'error');

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 selection:bg-blue-100">
      <Navbar />
      
      <div className="bg-gradient-to-br from-[#1a2333] to-[#121824] pt-24 pb-32 text-center text-white px-4 border-b border-gray-800">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          World-Class Image Compressor
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
          Reduce file size by up to 90% while flawlessly preserving visual quality. Faster load times. Better SEO. 
        </p>
      </div>

      <div className="max-w-7xl mx-auto -mt-20 px-4 flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* Main Workspace */}
        <main className="flex-grow w-full order-2 lg:order-1">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            
            {/* Upload Area */}
            <div 
              className={`p-12 transition-all duration-300 relative border-b border-gray-100 ${isDragging ? 'bg-blue-50/50' : 'bg-white'}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              {isDragging && (
                <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-3xl z-20 bg-blue-500/10 pointer-events-none"></div>
              )}
              
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-50 text-[#1557b0] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Drop your images here</h3>
                <p className="text-gray-500 mb-6">Or paste (Ctrl+V) / click to browse. Supports JPG, PNG, WebP, AVIF, GIF.</p>
                <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={(e) => { if(e.target.files) addFiles(Array.from(e.target.files)); }} />
                <button onClick={() => fileInputRef.current?.click()} className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full hover:bg-black hover:scale-105 transition-all shadow-lg">
                  Select Files
                </button>
              </div>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="p-6 bg-gray-50/50">
                <div className="flex justify-between items-center mb-6 px-2">
                  <h3 className="text-lg font-bold text-gray-800">Queue ({files.length})</h3>
                  {totalSaved > 0 && (
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2">
                      <Zap size={16} /> Total Saved: {formatSize(totalSaved)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {files.map((file) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={file.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                          <img src={file.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                          <h4 className="font-bold text-gray-900 truncate mb-1" title={file.originalFile.name}>{file.originalFile.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 gap-4 mb-3">
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{formatSize(file.originalSize)}</span>
                            {file.compressedSize && (
                              <>
                                <span className="text-gray-300">→</span>
                                <span className="font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-xs">{formatSize(file.compressedSize)}</span>
                              </>
                            )}
                          </div>
                          
                          {file.status === 'success' && (
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium border border-blue-100">Quality: {file.quality}%</span>
                              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-medium border border-purple-100">Format: {file.outputFormat}</span>
                              {file.savedPercentage && file.savedPercentage > 0 && (
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold border border-green-100">-{file.savedPercentage}% Size</span>
                              )}
                            </div>
                          )}

                          {file.status === 'error' && (
                            <div className="text-red-500 text-sm font-medium">{file.errorMsg}</div>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center gap-3">
                          {file.status === 'pending' && <button onClick={() => compressSingle(file.id)} className="text-[#1557b0] font-bold text-sm hover:underline px-3 py-2">Compress</button>}
                          {file.status === 'compressing' && <div className="w-6 h-6 border-2 border-[#1557b0] border-t-transparent rounded-full animate-spin"></div>}
                          {file.status === 'success' && file.compressedUrl && (
                            <a href={file.compressedUrl} download={file.originalFile.name} className="bg-[#1557b0] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-blue-700 transition-colors flex items-center gap-2">
                              <DownloadCloud size={16} /> Download
                            </a>
                          )}
                          <button onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))} className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Remove">✕</button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                  <button onClick={() => setFiles([])} className="text-gray-500 font-bold hover:text-red-500 text-sm">Clear All</button>
                  <div className="flex gap-4">
                    {allDone && totalSaved > 0 && (
                      <button onClick={downloadZip} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg hover:-translate-y-0.5 transition-all">
                        <DownloadCloud size={20} /> Download All ZIP
                      </button>
                    )}
                    {!allDone && (
                      <button onClick={compressAll} disabled={isCompressing} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${isCompressing ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-[#1557b0] text-white hover:bg-blue-800 hover:-translate-y-0.5'}`}>
                        {isCompressing ? 'Processing...' : 'Compress All'}
                        {!isCompressing && <Zap size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-[350px] shrink-0 order-1 lg:order-2">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Settings size={20} className="text-[#1557b0]" /> Compression Settings</h2>
            
            {/* Modes */}
            <div className="space-y-3 mb-8">
              <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${mode === 'smart' ? 'border-[#1557b0] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="mode" checked={mode === 'smart'} onChange={() => setMode('smart')} className="mt-1 w-4 h-4 text-[#1557b0]" />
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">Smart Compress <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full">Recommended</span></div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">Auto-optimizes visually for maximum savings and untouched perceived quality.</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${mode === 'custom' ? 'border-[#1557b0] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="mode" checked={mode === 'custom'} onChange={() => setMode('custom')} className="mt-1 w-4 h-4 text-[#1557b0]" />
                <div className="w-full">
                  <div className="font-bold text-gray-900">Custom Quality</div>
                  <div className="text-xs text-gray-500 mt-1">Manually set the exact compression ratio.</div>
                  {mode === 'custom' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                        <span>Smaller File</span>
                        <span>{quality}%</span>
                        <span>Higher Quality</span>
                      </div>
                      <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[#1557b0]" />
                    </div>
                  )}
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${mode === 'target' ? 'border-[#1557b0] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="mode" checked={mode === 'target'} onChange={() => setMode('target')} className="mt-1 w-4 h-4 text-[#1557b0]" />
                <div className="w-full">
                  <div className="font-bold text-gray-900">Target File Size</div>
                  <div className="text-xs text-gray-500 mt-1">Force image to hit a specific KB limit.</div>
                  {mode === 'target' && (
                    <div className="mt-3 flex items-center gap-2">
                      <input type="number" min="10" value={targetSizeKb} onChange={(e) => setTargetSizeKb(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 font-mono" />
                      <span className="text-gray-600 font-bold text-sm">KB</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Advanced Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Convert Format</label>
                <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#1557b0] outline-none">
                  <option value="original">Keep Original Format</option>
                  <option value="webp">Convert to WebP (Best Size)</option>
                  <option value="jpg">Convert to JPG (Best Compatibility)</option>
                  <option value="png">Convert to PNG (Lossless)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                  Resize Width (px)
                  <span className="text-xs text-gray-400 font-normal">Optional</span>
                </label>
                <input type="number" placeholder="e.g. 1920" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value ? Number(e.target.value) : '')} className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#1557b0] outline-none font-mono" />
                <p className="text-[10px] text-gray-400 mt-1.5">Height automatically adjusts to maintain aspect ratio.</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={keepMetadata} onChange={(e) => setKeepMetadata(e.target.checked)} className="w-4 h-4 rounded text-[#1557b0] focus:ring-[#1557b0]" />
                <span className="text-sm font-bold text-gray-700">Keep EXIF Metadata</span>
              </label>
            </div>
            
          </div>
          
          <div className="mt-6">
            <AdSidebar />
          </div>
        </aside>

      </div>
    </div>
  );
}
