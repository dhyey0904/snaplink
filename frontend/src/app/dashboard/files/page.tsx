"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { fetchAPI } from "@/utils/api";
import Footer from '@/components/Footer';

const SHORT_LINK_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/` : "http://127.0.0.1:8000/";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function Dashboard() {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  
  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Current active file to show on the right panel
  const [activeFile, setActiveFile] = useState<any | null>(null);
  const [filePassword, setFilePassword] = useState(""); // Optionally allow them to set a password during upload
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAPI('/files')
      .then(data => {
        setFiles(data);
        if (data.length > 0) {
          setActiveFile(data[0]); // default to most recent
        }
      })
      .catch(err => {
        if (err.message.includes('401')) {
          router.push('/login');
        }
      });
  }, [router]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (filePassword) formData.append('password', filePassword);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/files/upload`);
      
      const token = localStorage.getItem('token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

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
          setFilePassword("");
          setUploading(false);
          setUploadProgress(100);
        } else {
          setUploading(false);
          alert('Upload failed: ' + xhr.responseText);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        alert('Upload failed due to network error');
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:h-20 sm:items-center py-3 sm:py-0">
            <div className="flex justify-between items-center w-full sm:w-auto">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">SnapLink Filez</h1>
                  <p className="text-xs font-medium text-gray-500">Secure File Sharing • Up to 1024MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
               {/* Quick Stats matching the Sharez UI top right */}
               <div className="flex border border-yellow-200 bg-yellow-50 rounded-xl overflow-hidden shadow-sm">
                 <div className="px-4 py-2 border-r border-yellow-200 flex flex-col justify-center">
                   <div className="text-xs text-yellow-600 font-bold uppercase tracking-wider">Status</div>
                   <div className="text-sm text-yellow-800 font-medium">Ready</div>
                 </div>
               </div>
               <div className="flex border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                 <div className="px-4 py-2 border-r border-gray-100 flex flex-col items-center">
                   <div className="text-xs text-gray-500 uppercase tracking-wider">Shared</div>
                   <div className="text-lg font-black text-gray-900">{files.length}</div>
                 </div>
                 <div className="px-4 py-2 flex flex-col items-center min-w-[100px]">
                   <div className="text-xs text-gray-500 uppercase tracking-wider">Size</div>
                   <div className="text-lg font-black text-gray-900">{formatBytes(files.reduce((acc, f) => acc + f.size_bytes, 0))}</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 py-4 flex items-center gap-2 font-medium text-sm transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Dashboard
            </Link>
            <div className="border-b-2 border-blue-500 text-blue-600 py-4 flex items-center gap-2 font-medium text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Share Files
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Upload and List */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Upload Box */}
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[400px] shadow-sm relative">
              <div 
                className="absolute inset-0 z-10 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
              />
              
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 z-0">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 z-0">Upload Files</h2>
              <p className="text-gray-500 mb-8 z-0">Drag and drop files here, or click to browse</p>
              
              {selectedFile ? (
                <div className="flex flex-col items-center z-20 w-full max-w-md">
                  <div className="text-lg font-medium text-gray-900 bg-gray-100 px-6 py-3 rounded-full mb-6 max-w-full truncate shadow-inner">
                    {selectedFile.name}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Set Password (Optional)"
                    className="mb-4 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
                    value={filePassword}
                    onChange={(e) => setFilePassword(e.target.value)}
                  />
                  
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
                <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-md z-20 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Select Files
                </button>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
                }} 
                className="hidden" 
              />
              
              <div className="mt-8 text-center z-0">
                <p className="text-sm font-medium text-gray-500">Maximum file size: <span className="text-gray-700 font-bold">1024MB</span></p>
                <p className="text-xs text-gray-400 mt-1">Files automatically expire in 5 minutes.</p>
              </div>
            </div>

            {/* File List */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm min-h-[250px]">
              {files.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {files.map((file) => (
                    <div 
                      key={file.id} 
                      onClick={() => setActiveFile(file)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${activeFile?.id === file.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeFile?.id === file.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{file.filename}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-gray-500">{formatBytes(file.size_bytes)}</span>
                            {file.expires_at && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                  5 min expiry
                                </span>
                              </>
                            )}
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
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No files shared yet</h3>
                  <p className="text-sm text-gray-500">Upload files above to start sharing</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Connection Info */}
          <div className="w-full lg:w-[450px] flex-shrink-0">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl sticky top-24">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative">
                <div className="absolute top-4 left-4">
                  <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold ml-10">Connection Info</h3>
                <p className="text-blue-100 ml-10 mt-1">Scan or connect to share files</p>
              </div>

              {/* Body */}
              <div className="p-8">
                {activeFile ? (
                  <>
                    <div className="bg-white p-6 border-2 border-gray-100 rounded-2xl flex justify-center items-center shadow-inner mb-6">
                      <QRCode value={`${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`} size={220} />
                    </div>
                    <p className="text-center text-gray-500 font-medium mb-8">Scan to connect instantly</p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">File Name</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value={activeFile.filename} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none"
                          />
                          <button onClick={() => handleCopy(activeFile.filename)} className="flex-shrink-0 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                          </button>
                        </div>
                      </div>

                      {activeFile.has_password && (
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password Protected</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              readOnly 
                              value="••••••••••••" 
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold tracking-widest outline-none"
                            />
                            <div className="flex-shrink-0 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Share Link</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value={`${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none truncate"
                          />
                          <button onClick={() => handleCopy(`${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`)} className="flex-shrink-0 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                          </button>
                        </div>
                        
                        <a href={`${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`} target="_blank" className="mt-4 w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
                          Preview Link
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    <p className="font-medium">Upload a file to generate connection info</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>

    </div>
  );
}
