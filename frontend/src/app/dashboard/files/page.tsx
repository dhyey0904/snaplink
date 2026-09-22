"use client";

import ConnectionInfoCard from '@/components/ConnectionInfoCard';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { fetchAPI } from "@/utils/api";
import AdOverlay from "@/components/AdOverlay";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const SHORT_LINK_DOMAIN = typeof window !== 'undefined' ? `${window.location.origin}/` : "http://localhost:3000/";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function Dashboard() {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  
  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Current active file to show on the right panel
  const [activeFile, setActiveFile] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const loadFiles = () => {
      fetchAPI('/files/me')
        .then(data => {
          setFiles(data);
          // Only auto-set activeFile on initial load if none is selected, 
          // or if the currently active file was deleted (expired)
          setActiveFile((curr: any) => {
            if (!curr && data.length > 0) return data[0];
            if (curr && !data.find((f: any) => f.id === curr.id)) return data.length > 0 ? data[0] : null;
            return curr;
          });
        })
        .catch(err => {
          if (err.message.includes('401')) router.push('/login');
        });
    };

    loadFiles();
    // Poll every 5 seconds to auto-remove expired files from UI and trigger DB deletion
    const pollInterval = setInterval(loadFiles, 5000);
    return () => clearInterval(pollInterval);
  }, [router]);

  useEffect(() => {
    if (!activeFile?.expires_at) {
      setTimeLeft('');
      return;
    }
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(activeFile.expires_at + 'Z').getTime();
      const distance = expiry - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('Expired');
        return;
      }
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeFile]);

  const handleCopy = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Copied to clipboard!');
      } catch (err) {
        alert('Failed to copy. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async () => {
    if (!activeFile) return;
    const url = `${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`;
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: 'Shared File on SnapLink',
          text: `Download ${activeFile.filename}`,
          url: url
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      handleCopy(url);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 1024 * 1024 * 1024) {
        alert("File too large. Maximum size is 1GB.");
        return;
      }
      setSelectedFile(file);
    }
  };

    const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setShowAd(true);
  };

  const executeUpload = async () => {
    setShowAd(false);
    setUploading(true);

    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile as File);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com"}/api/files/upload`);
      
      const token = localStorage.getItem('token');
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const newFile = JSON.parse(xhr.responseText);
          setFiles([newFile, ...files]);
          setActiveFile(newFile);
          setSelectedFile(null);
          setUploading(false);
          setUploadProgress(100);
        } else {
          setUploading(false);
          alert('Upload failed: ' + xhr.responseText);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        alert('Upload failed due to network error.');
      };

      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file? Any existing links will stop working.')) return;
    try {
      await fetchAPI(`/files/${id}`, { method: 'DELETE' });
      setFiles(files.filter(f => f.id !== id));
      if (activeFile && activeFile.id === id) {
        setActiveFile(files.find(f => f.id !== id) || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col font-sans">
      {showAd && <AdOverlay onComplete={executeUpload} actionText="Starting Upload" />}
      <Navbar />

      

      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-12 relative z-20 mb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Column */}
          <div className="w-full md:flex-1 flex flex-col gap-8">
            
            {/* Upload Box */}
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[400px] shadow-xl relative overflow-hidden">
              <div 
                className="absolute inset-0 z-10 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
              />
              <input type="file" className="hidden text-gray-900 placeholder-gray-600" ref={fileInputRef} onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  if (file.size > 1024 * 1024 * 1024) { alert("File too large. Maximum size is 1GB."); e.target.value = ''; return; }
                  setSelectedFile(file);
                }
              }} />
              
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 z-0">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 z-0">Upload Files</h2>
              <p className="text-gray-500 mb-8 z-0">Drag and drop files here, or click to browse</p>
              
              {selectedFile ? (
                <div className="flex flex-col items-center z-20 w-full max-w-md pointer-events-auto">
                  <div className="text-lg font-medium text-gray-900 bg-gray-100 px-6 py-3 rounded-full mb-6 max-w-full truncate shadow-inner">
                    {selectedFile.name}
                  </div>
                  
                  {uploading ? (
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleUpload}
                      className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full flex justify-center items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      Confirm Upload
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-8 text-center z-0">
                  <p className="text-sm font-medium text-gray-500">Maximum file size: <span className="text-gray-700 font-bold">1024MB</span></p>
                  <p className="text-xs text-gray-400 mt-1">Files automatically expire in 5 minutes.</p>
                </div>
              )}
            </div>

            
            {/* MOBILE ONLY: Connection Info */}
            <div className="w-full block md:hidden">
              <ConnectionInfoCard activeFile={activeFile} handleShare={handleShare} handleDelete={handleDelete} handleCopy={handleCopy} timeLeft={timeLeft} SHORT_LINK_DOMAIN={SHORT_LINK_DOMAIN} />
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
              <div className="space-y-4">
              {files.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {files.map(file => (
                    <div 
                      key={file.id} 
                      onClick={() => setActiveFile(file)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${activeFile?.id === file.id ? 'border-[#1a73e8] bg-[#e8f0fe] shadow-sm' : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeFile?.id === file.id ? 'bg-[#1a73e8] text-white' : 'bg-gray-200 text-gray-600'}`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{file.filename}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{formatBytes(file.size_bytes)}</span>
                            {file.has_password && <span className="text-xs text-amber-600 font-bold flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Locked</span>}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No files shared yet</h3>
                  <p className="text-sm text-gray-500">Upload files above to start sharing</p>
                </div>
              )}
            </div>
          </div>

          </div> {/* End Left Column */}

          {/* DESKTOP ONLY: Connection Info */}
          <div className="hidden md:block w-full md:w-[350px] lg:w-[400px] xl:w-[450px] md:sticky md:top-8 flex-shrink-0">
            <ConnectionInfoCard activeFile={activeFile} handleShare={handleShare} handleDelete={handleDelete} handleCopy={handleCopy} timeLeft={timeLeft} SHORT_LINK_DOMAIN={SHORT_LINK_DOMAIN} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
        );
}
