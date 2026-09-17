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
  const adSensePubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  useEffect(() => {
    // Initialize AdSense if ad slot is rendered
    if (adSensePubId) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {}
    }
  }, [adSensePubId]);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
        // Fetch to log the click and get the destination!
        const res = await fetch(`${backendUrl}/${shortCode}?json=true`);
        const data = await res.json();
        
        if (!res.ok) {
          if (data.detail === "Password required or incorrect") {
             router.push(`/unlock/${shortCode}`);
             return;
          }
          throw new Error(data.detail || "Link not found");
        }
        
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
    } else {
      window.location.href = originalUrl;
    }
  }, [countdown, originalUrl]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      {adSensePubId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSensePubId}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
      
      <div className="bg-[#f8f9fa] rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-[#202124]">Generating your short link...</h2>
          <span className="text-sm text-gray-500">Advertisement</span>
        </div>

        {/* Ad Container */}
        <div className="flex justify-center items-center py-12 bg-[#f8f9fa]">
          <div className="w-[300px] h-[250px] bg-[#dce0e5] border border-[#bdc1c6] flex items-center justify-center relative overflow-hidden">
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

        {/* Footer Countdown */}
        <div className="text-center py-8 bg-[#f8f9fa]">
          {countdown > 0 ? (
            <p className="text-xl text-[#202124]">
              Your link will be ready in <span className="text-3xl font-extrabold text-[#1a73e8] mx-1">{countdown}</span> seconds
            </p>
          ) : (
            <div className="flex justify-center">
              <button 
                onClick={() => { if (originalUrl) window.location.href = originalUrl; }}
                className="px-8 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg transition-colors text-lg"
              >
                Continue to Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
