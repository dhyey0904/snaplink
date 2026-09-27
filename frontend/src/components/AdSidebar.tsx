"use client";

import React, { useEffect } from 'react';

export default function AdSidebar({ slot = "1234567890" }: { slot?: string }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
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
