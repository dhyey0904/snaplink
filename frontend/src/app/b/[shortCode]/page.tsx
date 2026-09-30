"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { DownloadCloud, ShieldAlert, Trash2, ShieldCheck, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function BridgeDownloadPage() {
  const { shortCode } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    fetchStatus();
  }, [shortCode]);

  const fetchStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/bridge/status/${shortCode}`);
      const json = await res.json();
      if (json.status === 'deleted') {
        setError(true);
      } else {
        setData(json);
        if (json.status === 'downloaded') {
           startTimer();
        }
      }
    } catch(e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    let t = 60;
    const timer = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timer);
        setError(true);
      }
    }, 1000);
  }

  const handleDownload = async () => {
    setDownloading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    // Trigger download securely
    const a = document.createElement('a');
    a.href = `${apiUrl}/bridge/download/${shortCode}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Update UI state to downloaded
    setData({...data, status: 'downloaded'});
    startTimer();
    setDownloading(false);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (loading) return <div className="min-h-screen bg-gray-50 pt-32 text-center text-gray-500 font-bold">Loading secure link...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-3xl mx-auto pt-24 px-4 flex items-center justify-center">
        {error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 w-full">
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={48} />
             </div>
             <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Transfer Expired</h1>
             <p className="text-lg text-gray-600">This file has self-destructed and was permanently deleted from our servers.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 w-full relative overflow-hidden">
             
             {data?.status === 'waiting' ? (
               <div className="text-center relative z-10">
                 <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-sm mb-8 shadow-sm">
                   <ShieldCheck size={16} /> End-to-End Secure
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-2 truncate px-4">{data.original_name}</h2>
                 <p className="text-gray-500 font-medium mb-10">{formatSize(data.size)}</p>
                 
                 <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-xl flex gap-4 items-start text-left mb-10 text-sm font-medium">
                   <ShieldAlert size={24} className="shrink-0 mt-0.5" />
                   <div>
                     <strong>Warning:</strong> This file will be permanently deleted from our servers 60 seconds after you download it.
                   </div>
                 </div>

                 <button onClick={handleDownload} disabled={downloading} className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3">
                   <DownloadCloud size={24} /> {downloading ? 'Decrypting...' : 'Download File'}
                 </button>
               </div>
             ) : (
               <div className="text-center relative z-10 py-8">
                 <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-6">
                   <Clock size={48} />
                 </motion.div>
                 <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Self-Destruct Sequence Initiated</h2>
                 <p className="text-lg text-gray-600 mb-8">This file and all metadata will be completely erased in</p>
                 <div className="text-7xl font-black text-orange-500 font-mono">{timeLeft}s</div>
               </div>
             )}

          </motion.div>
        )}
      </main>
    </div>
  );
}
