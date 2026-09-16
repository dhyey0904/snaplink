"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/utils/api";

export default function ApiDashboard() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading && !apiKey) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-xl">Loading API Data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Snap<span className="text-blue-600">Link</span> Developer</h1>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Link-in-Bio
          </Link>
          <Link href="/dashboard/links" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
            URL Shortener
          </Link>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 font-medium">Logout</button>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Developer API (SaaS)</h2>
          <p className="text-gray-600 mb-8">
            Use your secret API key to programmatically generate short links from your own applications, scripts, or backend servers.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">Your Secret API Key</h3>
            
            {apiKey ? (
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white p-3 rounded border border-gray-300 font-mono text-sm tracking-wider break-all flex items-center justify-between">
                  {revealed ? apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••"}
                  <button onClick={() => setRevealed(!revealed)} className="ml-4 text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">
                    {revealed ? "Hide" : "Reveal"}
                  </button>
                </div>
                <button onClick={handleCopy} className="px-4 py-3 bg-gray-800 text-white rounded font-bold hover:bg-gray-900 transition shrink-0">
                  Copy
                </button>
                <button onClick={handleGenerateKey} className="px-4 py-3 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200 transition shrink-0">
                  Regenerate
                </button>
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
      </main>
    </div>
  );
}
