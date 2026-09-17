"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { fetchAPI } from "@/utils/api";

export default function ApiDashboard() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadUser();
  }, [router]);

  const loadUser = async () => {
    try {
      const data = await fetchAPI("/auth/me");
      setApiKey(data.api_key);
      setTier(data.tier || "free");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (paying) return;
    setPaying(true);
    
    try {
      // 1. Create order on backend
      const order = await fetchAPI("/payment/create-order", { method: "POST" });
      
      // 2. Open Razorpay Checkout
      const options = {
        key: order.key_id, 
        amount: order.amount,
        currency: order.currency,
        name: "SnapLink Pro",
        description: "Lifetime API Access",
        order_id: order.order_id,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          try {
            await fetchAPI("/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            alert("Payment Successful! Welcome to Pro.");
            window.location.reload();
          } catch (err) {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Developer",
          email: "dev@example.com"
        },
        theme: {
          color: "#1a73e8"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      rzp.open();
      
    } catch (err: any) {
      alert("Could not start payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handleGenerateKey = async () => {
    if (apiKey && !confirm("Generating a new API key will invalidate your old one. Are you sure?")) {
      return;
    }
    
    try {
      setLoading(true);
      const data = await fetchAPI("/auth/api-key", { method: "POST" });
      setApiKey(data.api_key);
      setRevealed(true);
    } catch (err: any) {
      alert(err.message || "Failed to generate key");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      alert("API Key copied to clipboard!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-[#202124]">
                Snap<span className="text-[#1a73e8]">Link</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                Link-in-Bio
              </Link>
              <Link href="/dashboard/links" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                URL Shortener
              </Link>
              <Link href="/dashboard/api" className="text-sm font-medium text-[#1a73e8] border-b-2 border-[#1a73e8] py-5">
                API Access
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-[#5f6368] hover:text-[#d93025] transition-colors ml-4">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {tier === "free" ? (
          <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-200 text-center max-w-2xl mx-auto mt-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PRO FEATURE</div>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Unlock the SnapLink API</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Automate your workflow. Generate thousands of short links instantly, integrate into your own apps, and build custom dashboards programmatically.
            </p>
            
            <div className="text-left bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Why businesses upgrade:</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Bulk URL Shortening for SMS & Email Campaigns
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Custom Discord & Slack Bot Integrations
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Direct CRM & Backend API Integration
                </li>
              </ul>
            </div>
            
            <button onClick={handlePurchase} disabled={paying} className="w-full py-4 px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {paying ? "Loading Payment..." : "Unlock API Access — ₹199"}
            </button>
            <p className="text-sm text-gray-400 mt-4">One-time payment. Lifetime access.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Developer API (Pro)</h2>
            <p className="text-gray-600 mb-8">
              Use your secret API key to programmatically generate short links from your own applications, scripts, or backend servers.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col gap-4">
              <h3 className="font-semibold text-gray-800">Your Secret API Key</h3>
              
              {apiKey ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full bg-white p-3 rounded border border-gray-300 font-mono text-sm tracking-wider break-all flex items-center justify-between">
                    {revealed ? apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    <button onClick={() => setRevealed(!revealed)} className="ml-4 text-xs font-bold text-blue-600 hover:text-blue-800 uppercase shrink-0">
                      {revealed ? "Hide" : "Reveal"}
                    </button>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={handleCopy} className="flex-1 sm:flex-none px-4 py-3 bg-gray-800 text-white rounded font-bold hover:bg-gray-900 transition shrink-0">
                      Copy
                    </button>
                    <button onClick={handleGenerateKey} className="flex-1 sm:flex-none px-4 py-3 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200 transition shrink-0">
                      Regen
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-4">You have not generated an API key yet.</p>
                  <button onClick={handleGenerateKey} className="px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition">
                    Generate API Key
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tier !== "free" && (
          <div className="bg-gray-900 rounded-xl shadow-sm p-8 border border-gray-800 text-white">
            <h3 className="text-xl font-bold mb-4">API Documentation</h3>
            <p className="text-gray-400 mb-6">Include your API key in the <code className="bg-gray-800 px-1 py-0.5 rounded text-blue-400">x-api-key</code> header to authenticate.</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Create a Short Link (POST)</h4>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                  <pre>{`curl -X POST https://snaplink-backend-j69v.onrender.com/api/links/ \\
    -H "Content-Type: application/json" \\
    -H "x-api-key: YOUR_API_KEY_HERE" \\
    -d '{
      "original_url": "https://example.com/very/long/url",
      "short_code": "my-custom-alias"
    }'`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#dadce0] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <span className="text-xl font-bold tracking-tight text-[#202124] mb-4 sm:mb-0">
            Snap<span className="text-[#1a73e8]">Link</span>
          </span>
          <p className="text-[#5f6368] text-sm">
            © {new Date().getFullYear()} SnapLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
