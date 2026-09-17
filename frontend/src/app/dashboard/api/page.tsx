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
      alert("Could not start payment. " + (err.message || "Please try again."));
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

      <main className="flex-1 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {tier === "free" ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#1a73e8] text-sm font-semibold mb-4 border border-blue-100 uppercase tracking-wide">
                  Developer Pro
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#202124] tracking-tight mb-6">
                  Build faster with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#9333ea]">SnapLink API</span>
                </h1>
                <p className="text-xl text-[#5f6368] max-w-2xl mx-auto">
                  Automate your workflow. Generate thousands of short links instantly, integrate into your own apps, and build custom dashboards programmatically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl border border-[#dadce0] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#202124] mb-4">Why upgrade to Pro?</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start text-[#5f6368]">
                        <svg className="w-6 h-6 text-[#1a73e8] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span><strong className="text-[#202124]">Bulk URL Shortening:</strong> Perfect for high-volume SMS & Email marketing campaigns.</span>
                      </li>
                      <li className="flex items-start text-[#5f6368]">
                        <svg className="w-6 h-6 text-[#1a73e8] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span><strong className="text-[#202124]">Custom Integrations:</strong> Connect SnapLink directly into your Discord bots, Slack, or internal tools.</span>
                      </li>
                      <li className="flex items-start text-[#5f6368]">
                        <svg className="w-6 h-6 text-[#1a73e8] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span><strong className="text-[#202124]">Seamless CRM Sync:</strong> Automatically generate tracked links for every new customer in your database.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-[#dadce0] shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1a73e8]/10 to-[#9333ea]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <h3 className="text-2xl font-bold text-[#202124] mb-2">Lifetime API Access</h3>
                  <div className="flex items-baseline justify-center mb-6">
                    <span className="text-5xl font-extrabold text-[#202124]">₹199</span>
                    <span className="text-xl text-[#5f6368] ml-2">net</span>
                  </div>
                  <p className="text-[#5f6368] mb-8">One-time payment. No subscriptions, no hidden fees. Complete developer access forever.</p>
                  
                  <button 
                    onClick={handlePurchase} 
                    disabled={paying} 
                    className="w-full py-4 px-8 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#8ab4f8] disabled:cursor-not-allowed text-white text-lg font-medium rounded-full transition-colors focus:ring-4 focus:ring-[#1a73e8]/20 shadow-sm"
                  >
                    {paying ? "Loading Secure Checkout..." : "Unlock API Access Now"}
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#5f6368]">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    Secured by Razorpay
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#202124] mb-2">Developer Dashboard</h1>
                <p className="text-[#5f6368] text-lg">Manage your API keys and read the integration documentation.</p>
              </div>

              {/* API Key Card */}
              <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm mb-10 overflow-hidden">
                <div className="px-8 py-6 border-b border-[#dadce0] bg-[#f8f9fa]">
                  <h3 className="text-xl font-bold text-[#202124]">Authentication</h3>
                  <p className="text-sm text-[#5f6368] mt-1">Your secret key must be kept safe. Do not share it publicly.</p>
                </div>
                <div className="p-8">
                  {apiKey ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1 w-full bg-[#f1f3f4] p-4 rounded-xl border border-[#dadce0] font-mono text-sm tracking-wider break-all flex items-center justify-between">
                        <span className="text-[#202124]">{revealed ? apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}</span>
                        <button onClick={() => setRevealed(!revealed)} className="ml-4 text-sm font-semibold text-[#1a73e8] hover:text-[#1557b0] uppercase tracking-wider shrink-0">
                          {revealed ? "Hide" : "Reveal"}
                        </button>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={handleCopy} className="flex-1 sm:flex-none px-6 py-4 bg-[#202124] text-white rounded-xl font-medium hover:bg-[#3c4043] transition-colors shrink-0">
                          Copy Key
                        </button>
                        <button onClick={handleGenerateKey} className="flex-1 sm:flex-none px-6 py-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-colors shrink-0">
                          Regenerate
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-[#5f6368] mb-6">You have not generated an API key yet.</p>
                      <button onClick={handleGenerateKey} className="px-8 py-3 bg-[#1a73e8] text-white rounded-full font-medium hover:bg-[#1557b0] transition-colors focus:ring-4 focus:ring-[#1a73e8]/20">
                        Generate API Key
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentation Card */}
              <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-[#dadce0]">
                  <h3 className="text-xl font-bold text-[#202124]">API Reference</h3>
                </div>
                <div className="p-8">
                  <p className="text-[#5f6368] mb-8">
                    All API requests must include your secret API key in the <code className="bg-[#f1f3f4] text-[#d93025] px-2 py-1 rounded text-sm font-mono border border-[#dadce0]">x-api-key</code> header.
                  </p>
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-bold tracking-wider">POST</span>
                      <h4 className="text-lg font-bold text-[#202124]">Create a Short Link</h4>
                    </div>
                    
                    <div className="bg-[#202124] rounded-xl overflow-hidden shadow-inner">
                      <div className="flex items-center px-4 py-2 bg-[#3c4043] text-gray-300 text-xs font-mono border-b border-gray-600">
                        <span>Terminal</span>
                      </div>
                      <div className="p-6 overflow-x-auto">
                        <pre className="font-mono text-sm text-[#8ab4f8] leading-relaxed">
                          <span className="text-white">curl -X POST</span> https://snaplink-backend-j69v.onrender.com/api/links/ \<br/>
                          <span className="text-white">  -H</span> "Content-Type: application/json" \<br/>
                          <span className="text-white">  -H</span> "x-api-key: YOUR_API_KEY_HERE" \<br/>
                          <span className="text-white">  -d</span> '{JSON.stringify({ original_url: "https://example.com/very/long/url", short_code: "my-custom-alias" }, null, 4)}'
                        </pre>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
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
