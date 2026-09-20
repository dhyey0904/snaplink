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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-white p-4">
      <h2 className="text-2xl font-bold mb-2">Advertisement</h2>
      <p className="text-gray-300 mb-6">{actionText} in {timeLeft} seconds...</p>
      
      <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden p-2 min-h-[100px]">
        <AdBanner dataAdSlot="5555555555" />
      </div>
    </div>
  );
}
