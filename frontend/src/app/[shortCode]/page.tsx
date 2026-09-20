"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { fetchAPI } from "@/utils/api";

export default function AdPage() {
  const { shortCode } = useParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const adSensePubId = "ca-pub-3444542685708016"; // Hardcoded from user

  useEffect(() => {
    // Initialize AdSense if ad slot is rendered
    if (adSensePubId && originalUrl) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {}
    }
  }, [adSensePubId, originalUrl]);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
        const res = await fetch(`${backendUrl}/${shortCode}?json=true`, { cache: "no-store" });
        const data = await res.json();
        
        if (!res.ok) {
          if (data.detail === "Password required or incorrect") {
             router.push(`/unlock/${shortCode}`);
             return;
          }
          throw new Error(data.detail || "Link not found");
        }
        
        // Anti-Double-Ad Logic: If the destination is an internal SnapLink vCard or File,
        // it already has its own AdOverlay. Instantly redirect to prevent showing two ads back-to-back!
        try {
          const dest = new URL(data.original_url);
          if (dest.pathname.startsWith('/v/') || dest.pathname.startsWith('/f/')) {
            window.location.replace(data.original_url);
            return;
          }
        } catch(e) {}
        
        setOriginalUrl(data.original_url);
      } catch (err: any) {
        setError(err.message);
      }
    };
    
    fetchLink();
  }, [shortCode, router]);

  useEffect(() => {
    if (!originalUrl) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, originalUrl]);

  if (error) {
    return <div className="min-h-screen bg-[#111827] flex items-center justify-center text-red-500 font-bold">{error}</div>;
  }

  // Show a blank dark screen while fetching the URL (preventing ad UI flash for internal links)
  if (!originalUrl) {
    return <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
    </div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#111827] text-white overflow-hidden p-4 sm:p-8">
      {adSensePubId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSensePubId}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      {/* Top Section - Timer or Button */}
      <div className="w-full flex justify-end mt-4">
        {countdown > 0 ? (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-xl">
            <svg className="w-5 h-5 text-gray-300 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span className="font-semibold text-lg">Redirecting in <span className="font-black text-[#3b82f6] text-xl w-6 inline-block text-center">{countdown}</span>s</span>
          </div>
        ) : (
          <button 
            onClick={() => window.location.href = originalUrl}
            className="flex items-center gap-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-full border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
          >
            Continue to Link
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        )}
      </div>

      {/* Middle Section - Ad Container */}
      <div className="flex-1 w-full max-w-4xl flex items-center justify-center my-6">
        <div className="w-full h-full max-h-[400px] bg-black/50 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
          <span className="absolute text-white/30 font-bold uppercase tracking-widest text-xs z-0 pointer-events-none">Advertisement</span>
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            {adSensePubId ? (
              <ins className="adsbygoogle"
                   style={{ display: "inline-block", width: "300px", height: "250px" }}
                   data-ad-client={adSensePubId}
                   data-ad-slot="4096463539"></ins>
            ) : (
              <span className="text-[#5f6368] font-medium text-lg">Ad Space (300x250)</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Branding */}
      <div className="mb-4 flex items-center gap-2 opacity-50">
        <span className="text-sm font-medium uppercase tracking-widest">Secured by</span>
        <span className="text-sm font-black tracking-tighter text-white">Snap<span className="text-[#3b82f6]">Link</span></span>
      </div>
    </div>
  );
}
