'use client';

import { useEffect, useState } from 'react';

export default function SnowEffect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* CSS injected dynamically for the snow animation */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }
      `}</style>
      
      {Array.from({length: 40}).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 7;
        const size = 2 + Math.random() * 4;
        const opacity = 0.3 + Math.random() * 0.5;

        return (
          <div 
            key={i} 
            className="absolute bg-blue-200 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" 
            style={{ 
              left: `${left}%`, 
              top: `-20px`, 
              width: `${size}px`, 
              height: `${size}px`, 
              opacity: opacity,
              animation: `fall ${duration}s linear ${delay}s infinite` 
            }} 
          />
        );
      })}
    </div>
  );
}
