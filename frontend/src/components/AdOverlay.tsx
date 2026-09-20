'use client';

import { useState, useEffect } from 'react';
import AdBanner from './AdBanner';

interface AdOverlayProps {
  onComplete: () => void;
  actionText?: string;
}

export default function AdOverlay({ onComplete, actionText = "Continuing" }: AdOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#111827] text-white overflow-hidden p-4 sm:p-8">
      {/* Top Section - Timer */}
      <div className="w-full flex justify-end mt-4">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-xl">
          <svg className="w-5 h-5 text-gray-300 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span className="font-semibold text-lg">{actionText} in <span className="font-black text-[#3b82f6] text-xl w-6 inline-block text-center">{timeLeft}</span>s</span>
        </div>
      </div>

      {/* Middle Section - Ad Container */}
      <div className="flex-1 w-full max-w-4xl flex items-center justify-center my-6">
        <div className="w-full h-full max-h-[400px] bg-black/50 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
          <span className="absolute text-white/30 font-bold uppercase tracking-widest text-xs z-0 pointer-events-none">Advertisement</span>
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            <AdBanner dataAdSlot="5555555555" />
          </div>
        </div>
      </div>

      {/* Bottom Section - Branding */}
      <div className="mb-4 flex items-center gap-2 opacity-50">
        <span className="text-sm font-medium uppercase tracking-widest">Sponsored by</span>
        <span className="text-sm font-black tracking-tighter text-white">Snap<span className="text-[#3b82f6]">Link</span></span>
      </div>
    </div>
  );
}
