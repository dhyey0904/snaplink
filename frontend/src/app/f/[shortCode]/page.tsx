'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function FileDownloadPage() {
  const { shortCode } = useParams();
  
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/files/public/${shortCode}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'File not found');
        }
        const data = await res.json();
        setMetadata(data);
        
        if (!data.has_password) {
          setVerifiedToken('not_required');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (shortCode) fetchMetadata();
  }, [shortCode, backendUrl]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError('');
    
    try {
      const res = await fetch(`${backendUrl}/api/files/public/${shortCode}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Incorrect password');
      }
      
      const data = await res.json();
      setVerifiedToken(data.token);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleDownload = () => {
    if (!verifiedToken) return;
    window.location.href = `${backendUrl}/api/files/download/${shortCode}?token=${verifiedToken}`;
  };

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a73e8]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-[#202124] mb-2">Unavailable</h1>
        <p className="text-lg text-[#5f6368]">{error}</p>
        <a href="/" className="mt-8 text-[#1a73e8] font-bold hover:underline">Return to SnapLink</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center py-12 px-4 sm:px-6">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden mt-12 border border-[#dadce0]">
        
        {/* Header */}
        <div className="bg-[#1a73e8] p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold truncate px-4" title={metadata.filename}>{metadata.filename}</h2>
          <p className="text-blue-100 mt-2 font-medium">{formatBytes(metadata.size_bytes)}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {metadata.has_password && !verifiedToken ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-[#202124]">Password Protected</h3>
                <p className="text-sm text-[#5f6368] mt-1">Please enter the password to download this file.</p>
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="block w-full px-4 py-3 border border-[#dadce0] rounded-xl focus:ring-[#1a73e8] focus:border-[#1a73e8] text-center text-lg"
                />
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm text-center font-medium">{passwordError}</p>
              )}

              <button
                type="submit"
                disabled={verifying || !password}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] focus:outline-none disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Unlock File'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-3 py-5 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] hover:scale-[1.02] transition-transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download File
              </button>
              
              <p className="mt-6 text-xs text-[#5f6368] uppercase tracking-wider font-bold">
                Securely hosted on SnapLink
              </p>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
