"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Shield, Plus, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BridgeLandingPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api`;
      const res = await fetch(`${apiUrl}/bridge/room`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push(`/b/${data.shortCode}`);
      }
    } catch (e) {
      alert("Failed to create space");
      setIsCreating(false);
    }
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      router.push(`/b/${joinCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-16 pb-12 px-4">
        <div className="text-center mb-16">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-bold text-sm mb-6 shadow-sm">
            <Shield size={16} /> SnapBridge Secure Space
          </motion.div>
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Transfer instantly. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Automatically disappears.</span>
          </motion.h1>
          <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-gray-800">Create a secure peer-to-peer room. Upload files, scan the QR code to join, and download instantly. Files self-destruct 60 seconds after download.</motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Create Room */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center flex flex-col justify-center items-center h-72">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Plus size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Space</h2>
            <p className="text-gray-700 mb-6 text-sm">Generate a secure room and QR code to start sharing files instantly.</p>
            <button onClick={createRoom} disabled={isCreating} className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50">
              {isCreating ? 'Creating...' : 'Create Secure Space'}
            </button>
          </motion.div>

          {/* Join Room */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center flex flex-col justify-center items-center h-72">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <LogIn size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Space</h2>
            <p className="text-gray-700 mb-6 text-sm">Enter a room code to join an existing secure transfer session.</p>
            <form onSubmit={joinRoom} className="w-full flex gap-2">
              <input type="text" placeholder="Enter Code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-center font-bold focus:outline-none focus:ring-2 focus:ring-purple-500" maxLength={8} />
              <button type="submit" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">Join</button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
