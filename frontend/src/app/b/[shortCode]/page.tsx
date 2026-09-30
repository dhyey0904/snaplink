"use client";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, UploadCloud, ShieldAlert, Trash2, ShieldCheck, Clock, File as FileIcon, X, CheckCircle, QrCode } from 'lucide-react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function BridgeRoomPage() {
  const { shortCode } = useParams();
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Poll for files
    fetchFiles();
    const interval = setInterval(fetchFiles, 2000);
    return () => clearInterval(interval);
  }, [shortCode]);

  const fetchFiles = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/bridge/room/${shortCode}/files`);
      if (res.ok) {
        const json = await res.json();
        setFiles(json.files);
      } else {
        setError("Room not found or expired.");
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleUpload = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      alert("File exceeds 100MB limit.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/bridge/room/${shortCode}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await fetchFiles();
    } catch(e) {
      alert("Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const downloadFile = (fileId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const a = document.createElement('a');
    a.href = `${apiUrl}/bridge/download/${fileId}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Optimistically update status so timer shows
    setFiles(files.map(f => f.id === fileId ? {...f, status: 'downloaded', downloaded_at: new Date().toISOString()} : f));
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const roomUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto pt-16 px-4 flex justify-center">
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 w-full">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 size={48} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Space Expired</h1>
            <p className="text-lg text-gray-600">This secure room has expired or been destroyed.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-5xl mx-auto pt-16 px-4 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold text-xs mb-3 shadow-sm">
              <ShieldCheck size={14} /> End-to-End Secure Room
            </div>
            <h1 className="text-4xl font-black text-gray-900 font-mono">Room: {shortCode}</h1>
            <p className="text-gray-500 font-medium mt-1">Anyone in this room can upload and download files.</p>
          </div>
          <button onClick={() => setShowQR(true)} className="bg-white border border-gray-200 shadow-sm text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <QrCode size={18} /> Show QR Code
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload Zone */}
          <div className="md:col-span-1">
             <div 
                className={`bg-white border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all h-[400px] ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${dragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <UploadCloud size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drop a file here</h3>
                <p className="text-gray-500 text-sm mb-8 font-medium px-4">Up to 100MB per file. Supports all formats.</p>
                
                <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors disabled:opacity-50 w-full">
                  {uploading ? 'Uploading...' : 'Browse Files'}
                </button>
             </div>
          </div>

          {/* Files List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileIcon size={20} className="text-blue-600" /> Files in this Room ({files.length})
              </h2>

              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileIcon size={24} className="opacity-50" />
                  </div>
                  <p className="font-medium">No files uploaded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {files.map(file => (
                      <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4 overflow-hidden">
                           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                              <FileIcon size={24} />
                           </div>
                           <div className="overflow-hidden">
                             <h4 className="font-bold text-gray-900 truncate">{file.original_name}</h4>
                             <p className="text-xs text-gray-500 font-medium">{formatSize(file.size)}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 pl-4">
                          {file.status === 'downloaded' ? (
                            <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-bold">
                              <Clock size={16} className="animate-pulse" /> Self-destructing...
                            </div>
                          ) : (
                            <button onClick={() => downloadFile(file.id)} className="bg-white border border-gray-200 shadow-sm p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
                              <DownloadCloud size={20} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQR(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Space</h3>
            <p className="text-gray-500 mb-8 font-medium">Scan this QR code with any device to instantly join this room.</p>
            <div className="bg-white p-4 rounded-2xl inline-block border-2 border-gray-100 shadow-sm mb-8">
              <QRCodeSVG value={roomUrl} size={200} />
            </div>
            <div className="bg-gray-100 p-3 rounded-xl font-mono text-xl font-black text-gray-800 tracking-widest mb-6">
              {shortCode}
            </div>
            <button onClick={() => setShowQR(false)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
