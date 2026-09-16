"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/utils/api";

export default function AdPage() {
  const { shortCode } = useParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
        // Fetch to log the click and get the destination!
        const res = await fetch(`${backendUrl}/api/redirect/${shortCode}`);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      
      {/* Top Banner Ad Placeholder */}
      <div className="w-[728px] h-[90px] bg-gray-300 flex items-center justify-center border border-gray-400 mb-8">
        <span className="text-gray-500 font-medium">Advertisement Space (728x90)</span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Snap<span className="text-blue-600">Link</span></h1>
        
        {!originalUrl ? (
          <p className="text-gray-600 py-4">Loading your destination...</p>
        ) : (
          <div className="py-6">
            <p className="text-gray-600 mb-4">Please wait while we prepare your link.</p>
            {countdown > 0 ? (
              <div className="text-4xl font-extrabold text-blue-600">{countdown}</div>
            ) : (
              <p className="text-green-600 font-bold">Redirecting...</p>
            )}
            
            <button 
              disabled={countdown > 0}
              onClick={() => window.location.href = originalUrl}
              className={`mt-6 px-6 py-2 rounded font-medium w-full ${countdown > 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {countdown > 0 ? 'Skip Ad in ' + countdown + 's' : 'Continue to Link'}
            </button>
          </div>
        )}
      </div>

      {/* Side Ads Placeholder Container */}
      <div className="flex gap-8 mt-8">
        <div className="w-[300px] h-[250px] bg-gray-300 flex items-center justify-center border border-gray-400">
          <span className="text-gray-500 font-medium">Ad (300x250)</span>
        </div>
        <div className="w-[300px] h-[250px] bg-gray-300 flex items-center justify-center border border-gray-400">
          <span className="text-gray-500 font-medium">Ad (300x250)</span>
        </div>
      </div>

    </div>
  );
}
