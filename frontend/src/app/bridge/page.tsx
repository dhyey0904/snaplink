"use client";
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, Clock, Link as LinkIcon, Trash2, Shield } from 'lucide-react';

export default function BridgeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('waiting'); // waiting, downloaded, deleted
  const [timeLeft, setTimeLeft] = useState<number>(60);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/bridge/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShortCode(data.shortCode);
        pollStatus(data.shortCode);
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const pollStatus = (code: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${apiUrl}/bridge/status/${code}`);
        const data = await res.json();
        
        if (data.status === 'downloaded' && status !== 'downloaded') {
          setStatus('downloaded');
          // Timer logic
          let t = 60;
          const timer = setInterval(() => {
            t--;
            setTimeLeft(t);
            if (t <= 0) {
              clearInterval(timer);
              setStatus('deleted');
              clearInterval(interval);
            }
          }, 1000);
        } else if (data.status === 'deleted') {
          setStatus('deleted');
          clearInterval(interval);
        }
      } catch (e) {}
    }, 2000);
  };

  const transferUrl = typeof window !== 'undefined' ? `${window.location.origin}/b/${shortCode}` : '';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-16 pb-12 px-4">
        <div className="text-center mb-12">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-bold text-sm mb-6 shadow-sm">
            <Shield size={16} /> SnapBridge Secure Transfer
          </motion.div>
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Transfer instantly. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Automatically disappears.</span>
          </motion.h1>
          <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-gray-600">Share files securely without permanent cloud storage. Files self-destruct 60 seconds after download.</motion.p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!shortCode ? (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="p-10">
                <div 
                  className={`border-3 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                >
                  <input type="file" ref={fileInputRef} onChange={(e) => { if(e.target.files) setFile(e.target.files[0]); }} className="hidden" />
                  
                  {!file ? (
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-inner">
                        <UploadCloud size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Drag & Drop your file here</h3>
                      <p className="text-gray-500 font-medium">or click to browse (Max 100MB)</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
                        <CheckCircle size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 truncate max-w-sm">{file.name}</h3>
                      <p className="text-gray-500 font-medium mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB Ready to transfer</p>
                      
                      <div className="flex gap-4">
                        <button onClick={() => setFile(null)} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                        <button onClick={uploadFile} disabled={isUploading} className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2">
                          {isUploading ? 'Encrypting & Uploading...' : 'Generate Secure Link'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="shared" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 flex flex-col items-center">
                
                {status === 'waiting' && (
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to transfer</h2>
                    <p className="text-gray-500 mb-8">Scan QR or share the link. Waiting for receiver...</p>
                    
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-8">
                      <QRCode value={transferUrl} size={200} />
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl w-full max-w-md">
                      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 font-mono text-sm flex-grow truncate text-gray-700">{transferUrl}</div>
                      <button onClick={() => navigator.clipboard.writeText(transferUrl)} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors shrink-0">
                        <LinkIcon size={20} />
                      </button>
                    </div>
                  </>
                )}

                {status === 'downloaded' && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6">
                      <Clock size={48} />
                    </motion.div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Downloaded!</h2>
                    <p className="text-xl text-gray-600">File is self-destructing in</p>
                    <div className="text-6xl font-black text-orange-500 mt-4 font-mono">{timeLeft}s</div>
                  </div>
                )}

                {status === 'deleted' && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
                      <Trash2 size={48} />
                    </motion.div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Securely Erased</h2>
                    <p className="text-xl text-gray-600 mb-8">The file and all traces have been permanently deleted from our servers.</p>
                    <button onClick={() => {setShortCode(null); setFile(null); setStatus('waiting');}} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black">Transfer Another File</button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
