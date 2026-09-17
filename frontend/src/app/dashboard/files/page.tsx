'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/utils/api';
import Footer from '@/components/Footer';
import QRCode from 'react-qr-code';

export default function FileShareDashboard() {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // QR Modal
  const [qrModalUrl, setQrModalUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SHORT_LINK_DOMAIN = process.env.NEXT_PUBLIC_SHORT_LINK_DOMAIN || 'http://localhost:3000/f/';

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetchFiles();
  }, [router]);

  const fetchFiles = async () => {
    try {
      const data = await fetchAPI('/files/me');
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 50MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (password) formData.append('password', password);
    if (expiresIn) formData.append('expires_in_days', expiresIn);

    try {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
      
      const res = await fetch(`${backendUrl}/api/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Upload failed');
      }

      // Refresh list and reset
      setSelectedFile(null);
      setPassword('');
      setExpiresIn('');
      await fetchFiles();
      
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: int) => {
    if (!confirm('Are you sure you want to delete this file? Any existing links will stop working.')) return;
    
    try {
      await fetchAPI(`/files/${id}`, { method: 'DELETE' });
      setFiles(files.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (shortCode: str) => {
    navigator.clipboard.writeText(`${SHORT_LINK_DOMAIN}${shortCode}`);
    alert('Link copied to clipboard!');
  };

  const handleShare = async (shortCode: str, filename: str) => {
    const fullUrl = `${SHORT_LINK_DOMAIN}${shortCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Download ${filename}`,
          text: `I shared a file with you via SnapLink:`,
          url: fullUrl,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopy(shortCode);
    }
  };

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-[#202124]">
                Snap<span className="text-[#1a73e8]">Link</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                Overview
              </Link>
              <Link href="/dashboard/files" className="text-sm font-medium text-[#1a73e8] border-b-2 border-[#1a73e8] py-5">
                File Sharing
              </Link>
              <Link href="/dashboard/bio" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                Bio Page
              </Link>
              <Link href="/dashboard/links" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                URL Shortener
              </Link>
              <Link href="/dashboard/vcard" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                Business Card
              </Link>
              <Link href="/dashboard/api" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                API Access
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-[#5f6368] hover:text-[#d93025] transition-colors ml-4">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Left Side - Upload Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dadce0] sticky top-24">
            <h2 className="text-xl font-bold text-[#202124] mb-6">Upload a File</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Drag and Drop Zone */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${selectedFile ? 'border-[#1a73e8] bg-blue-50' : 'border-[#dadce0] hover:border-gray-400 hover:bg-gray-50'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }} 
                />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-[#1a73e8] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="font-semibold text-[#202124] truncate max-w-full px-4">{selectedFile.name}</p>
                    <p className="text-sm text-[#5f6368] mt-1">{formatBytes(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-[#5f6368] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="font-medium text-[#202124]">Click to upload or drag and drop</p>
                    <p className="text-sm text-[#5f6368] mt-1">PDF, Images, Video, ZIP (Max 50MB)</p>
                  </div>
                )}
              </div>

              {/* Password Protection */}
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1">
                  Password Protection (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Require password to download"
                    className="block w-full pl-10 pr-3 py-2 border border-[#dadce0] rounded-lg focus:ring-[#1a73e8] focus:border-[#1a73e8] sm:text-sm"
                  />
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1">
                  Auto Expiry (Optional)
                </label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className="block w-full px-3 py-2 border border-[#dadce0] rounded-lg focus:ring-[#1a73e8] focus:border-[#1a73e8] sm:text-sm"
                >
                  <option value="">Never expire</option>
                  <option value="1">Expire in 24 hours</option>
                  <option value="7">Expire in 7 days</option>
                  <option value="30">Expire in 30 days</option>
                </select>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {uploadError}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </div>
                ) : 'Upload File'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - File List */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-[#dadce0] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#dadce0] bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#202124]">Your Shared Files</h2>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-[#5f6368]">Loading files...</div>
            ) : files.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-[#202124] mb-1">No files shared yet</h3>
                <p className="text-[#5f6368] max-w-sm">Upload a file from the left panel to generate a secure shareable link.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#dadce0]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">File</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Security</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Downloads</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#dadce0]">
                    {files.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#202124] max-w-[200px] truncate" title={file.filename}>
                                {file.filename}
                              </div>
                              <div className="text-xs text-[#5f6368]">
                                {formatBytes(file.size_bytes)} • {new Date(file.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {file.has_password && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Password
                              </span>
                            )}
                            {file.expires_at && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Expires
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold text-sm">
                            {file.downloads}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <a href={`${SHORT_LINK_DOMAIN}${file.short_code}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1a73e8]" title="Visit Page">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                            <button onClick={() => setQrModalUrl(`${SHORT_LINK_DOMAIN}${file.short_code}`)} className="text-gray-400 hover:text-[#202124]" title="QR Code">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            </button>
                            <button onClick={() => handleShare(file.short_code, file.filename)} className="text-gray-400 hover:text-[#1a73e8]" title="Share">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            </button>
                            <button onClick={() => handleCopy(file.short_code)} className="text-gray-400 hover:text-[#202124]" title="Copy URL">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                            </button>
                            <button onClick={() => handleDelete(file.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative text-center">
            <button 
              onClick={() => setQrModalUrl('')}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h3 className="text-xl font-bold text-[#202124] mb-6">Scan to Download</h3>
            
            <div className="bg-white p-4 border border-gray-100 rounded-xl inline-block shadow-sm">
              <QRCode value={qrModalUrl} size={200} />
            </div>
            
            <p className="mt-6 text-sm text-[#5f6368] break-all bg-gray-50 p-3 rounded-lg border border-gray-100">
              {qrModalUrl}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
