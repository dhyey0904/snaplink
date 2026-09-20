'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useParams } from 'next/navigation';
import AdOverlay from '@/components/AdOverlay';

export default function FileDownloadPage() {
  const { shortCode } = useParams();
  
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAd, setShowAd] = useState(false);
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");

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

  // Expiration countdown timer
  useEffect(() => {
    if (!metadata?.expires_at) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(metadata.expires_at + 'Z').getTime(); // append Z for UTC
      const distance = expiry - now;

      if (distance < 0) {
        clearInterval(interval);
        setError("This file link has expired and was permanently deleted.");
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [metadata]);

  const verifyPin = async (fullPin: string) => {
    setVerifying(true);
    setPasswordError('');
    
    try {
      const res = await fetch(`${backendUrl}/api/files/public/${shortCode}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: fullPin })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Incorrect PIN');
      }
      
      const data = await res.json();
      setVerifiedToken(data.token);
    } catch (err: any) {
      setPasswordError(err.message);
      // Optional: clear PIN on error
      // setPin(['', '', '', '', '', '']);
      // inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (val: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = val.slice(-1); // Only take the last character typed
    setPin(newPin);

    // Auto-advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (val && index === 5 && newPin.every(digit => digit !== '')) {
      verifyPin(newPin.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newPin = [...pin];
    for (let i = 0; i < pastedData.length; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
      verifyPin(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

    const handleDownload = () => {
    if (metadata.has_password && !verifiedToken) return;
    setShowAd(true);
  };

  const executeDownload = () => {
    setShowAd(false);

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
      <div className="min-h-screen bg-[#fafafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1a73e8] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-[#202124] mb-2 tracking-tight">File Unavailable</h1>
        <p className="text-lg text-[#5f6368] text-center max-w-md">{error}</p>
        <a href="https://snaplink.in" className="mt-8 px-6 py-3 bg-[#202124] text-white font-bold rounded-full hover:bg-black transition-colors shadow-md">Get SnapLink</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center font-sans overflow-hidden relative">
      {showAd && <AdOverlay onComplete={executeDownload} actionText="Downloading Securely" />}
      
      {/* SnapLink Brand Header */}
      <div className="w-full flex justify-center sm:justify-start sm:pl-8 mb-8 sm:absolute sm:top-8 sm:mb-0 z-20 relative">
        <div className="flex items-center">
          <span className="text-2xl font-black tracking-tighter text-[#202124]">Snap<span className="text-[#1a73e8]">Link</span></span>
        </div>
      </div>

      <div className="w-full max-w-lg z-10 px-4">
        
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white">
          
          {/* Header */}
          <div className="bg-[#f8f9fa] p-6 sm:p-10 text-center border-b border-gray-100 relative">
            {timeLeft && (
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  Expires in {timeLeft}
                </div>
              </div>
            )}
            
            <div className="w-24 h-24 bg-gradient-to-br from-[#1a73e8] to-[#9333ea] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3">
              <svg className="w-12 h-12 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-extrabold text-[#202124] truncate px-4 tracking-tight" title={metadata.filename}>{metadata.filename}</h2>
            <p className="text-[#5f6368] mt-2 font-bold uppercase tracking-widest text-sm">{formatBytes(metadata.size_bytes)} • Secure Transfer</p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            
            {metadata.has_password && !verifiedToken ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#202124]">PIN Protected</h3>
                  <p className="text-[#5f6368] mt-2 text-sm">Enter the 6-digit secure PIN to access this file.</p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-3xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#1a73e8] focus:ring-0 outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm text-center font-bold">{passwordError}</p>
                )}

                <button
                  onClick={() => verifyPin(pin.join(''))}
                  disabled={verifying || pin.some(d => !d)}
                  className="w-full flex justify-center py-5 px-4 rounded-2xl shadow-lg shadow-blue-500/30 text-lg font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {verifying ? 'Verifying...' : 'Unlock Securely'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-3 py-5 px-4 rounded-2xl shadow-xl shadow-green-500/20 text-lg font-bold text-white bg-[#10b981] hover:bg-[#059669] hover:scale-[1.02] transition-transform"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download Safely
                </button>
                
                <p className="mt-8 text-xs text-[#5f6368] uppercase tracking-wider font-bold opacity-70">
                  Secured by SnapLink 
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
