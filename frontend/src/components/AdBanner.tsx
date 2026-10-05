"use client";

import React, { useEffect } from 'react';

export default function AdBanner({ slot = "0987654321" }: { slot?: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const unfilled = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
        
        if (unfilled.length > 0 && !window._adsense_push_pending) {
          window._adsense_push_pending = true;
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setTimeout(() => {
            window._adsense_push_pending = false;
          }, 500);
        }
      } catch (e: any) {
        if (!e.message?.includes('already have ads')) {
           console.error("AdSense error", e);
        }
      }
    }, 150); // Slightly longer timeout than sidebar to prioritize sidebar loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-[728px] mx-auto mt-10 mb-2 flex justify-center relative rounded-xl overflow-hidden xl:hidden min-h-[50px]">
      {/* Fallback styling placeholder */}
      
      
      {/* Real AdSense Ad Unit - Responsive */}
      <ins className="adsbygoogle relative z-10 w-full"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-3444542685708016"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}
