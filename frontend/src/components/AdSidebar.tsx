"use client";

import React, { useEffect } from 'react';

// Extend window object for our custom flag
declare global {
  interface Window {
    adsbygoogle: any;
    _adsense_push_pending?: boolean;
  }
}

export default function AdSidebar({ slot = "1234567890" }: { slot?: string }) {
  useEffect(() => {
    // Only push if there are unfilled ads and we aren't already pushing
    const timer = setTimeout(() => {
      try {
        const unfilled = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
        
        if (unfilled.length > 0 && !window._adsense_push_pending) {
          window._adsense_push_pending = true;
          
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          
          // Reset flag after AdSense has had time to process the DOM
          setTimeout(() => {
            window._adsense_push_pending = false;
          }, 500);
        }
      } catch (e: any) {
        // Silently catch the "already have ads" error as it's harmless
        if (e.message && e.message.includes('already have ads')) {
           console.warn("AdSense layout shift prevented");
        } else {
           console.error("AdSense error", e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-[300px] h-[600px] bg-gray-50 border border-gray-100 rounded-lg flex flex-col items-center justify-center relative overflow-hidden mx-auto sticky top-24">
      {/* Fallback styling placeholder for dev or adblockers */}
      <span className="absolute top-2 right-3 text-[9px] uppercase tracking-wider font-bold text-gray-300 pointer-events-none z-0">Advertisement</span>
      
      {/* Real AdSense Ad Unit */}
      <ins className="adsbygoogle relative z-10"
           style={{ display: 'inline-block', width: '300px', height: '600px' }}
           data-ad-client="ca-pub-3444542685708016"
           data-ad-slot={slot}></ins>
    </div>
  );
}
