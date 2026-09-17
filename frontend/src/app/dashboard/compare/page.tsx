"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";
import Footer from '@/components/Footer';

export default function CompareDashboard() {
  const router = useRouter();
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1 || !url2) {
      setError("Please enter both URLs.");
      return;
    }
    
    // Ensure they have http:// or https://
    const u1 = url1.startsWith("http") ? url1 : `https://${url1}`;
    const u2 = url2.startsWith("http") ? url2 : `https://${url2}`;

    setLoading(true);
    setError("");
    setResults(null);
    try {
      const data = await fetchAPI("/compare/", {
        method: "POST",
        body: JSON.stringify({ url1: u1, url2: u2 }),
      });
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to compare websites.");
    } finally {
      setLoading(false);
    }
  };

  const renderMetric = (label: string, category: string) => {
    if (!results) return null;
    const cat = results[category];
    const s1 = cat.score1;
    const s2 = cat.score2;
    const w = cat.winner;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#dadce0] p-6 mb-6">
        <h3 className="text-lg font-bold text-[#202124] mb-4 text-center">{label}</h3>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          
          <div className={`flex-1 text-center p-4 rounded-xl ${w === 1 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent'}`}>
            <div className="text-4xl font-black text-[#202124] mb-2">{s1}%</div>
            <div className="text-sm font-medium text-[#5f6368]">Your Website</div>
            {w === 1 && <div className="mt-2 text-xs font-bold text-green-700 bg-green-100 py-1 px-3 rounded-full inline-block">WINNER</div>}
          </div>
          
          <div className="text-[#5f6368] font-bold text-xl px-4 hidden sm:block">VS</div>
          
          <div className={`flex-1 text-center p-4 rounded-xl ${w === 2 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent'}`}>
            <div className="text-4xl font-black text-[#202124] mb-2">{s2}%</div>
            <div className="text-sm font-medium text-[#5f6368]">Competitor</div>
            {w === 2 && <div className="mt-2 text-xs font-bold text-green-700 bg-green-100 py-1 px-3 rounded-full inline-block">WINNER</div>}
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#dadce0] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span className="text-xl font-bold text-[#202124] tracking-tight">SnapLink</span>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-lg transition-colors">Overview</Link>
            <Link href="/dashboard/links" className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-lg transition-colors">Links</Link>
            <Link href="/dashboard/bio" className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-lg transition-colors">Bio Pages</Link>
            <Link href="/dashboard/vcard" className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-lg transition-colors">vCards</Link>
            <Link href="/dashboard/files" className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-lg transition-colors">File Sharing</Link>
            <Link href="/dashboard/compare" className="px-4 py-2 text-sm font-bold text-[#1a73e8] bg-blue-50 rounded-lg transition-colors">Compare</Link>
            <Link href="/dashboard/api" className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-lg transition-colors">API</Link>
          </nav>

          <div className="flex items-center">
            <button onClick={handleLogout} className="text-sm font-medium text-[#5f6368] hover:text-[#d93025] transition-colors ml-4">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#202124] tracking-tight mb-4">Competitor Analysis</h1>
          <p className="text-[#5f6368] text-lg">See how your website stacks up against the competition in Speed, SEO, and UX.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#dadce0] p-6 sm:p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full -z-10 opacity-50"></div>
          
          <form onSubmit={handleCompare} className="space-y-6 relative z-10">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#202124] mb-2">Your Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={url1}
                    onChange={(e) => setUrl1(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#1a73e8] focus:border-[#1a73e8] shadow-sm transition-colors"
                    placeholder="apple.com"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center hidden sm:flex">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-black mt-6">
                  VS
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-bold text-[#202124] mb-2">Competitor Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={url2}
                    onChange={(e) => setUrl2(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#1a73e8] focus:border-[#1a73e8] shadow-sm transition-colors"
                    placeholder="samsung.com"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1a73e8] text-white rounded-full font-bold hover:bg-[#1557b0] transition-colors shadow-md focus:ring-4 focus:ring-[#1a73e8]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Performance... (This takes up to 40s)
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    Run Comparison
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {results && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center shadow-lg text-white">
              <h2 className="text-2xl font-black mb-2">Analysis Complete</h2>
              <p className="text-blue-100 text-lg font-medium">{results.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                {renderMetric("Performance & Speed", "performance")}
                {renderMetric("Accessibility (UX)", "accessibility")}
              </div>
              <div className="flex flex-col gap-6">
                {renderMetric("SEO & Search Ranking", "seo")}
                {renderMetric("Best Practices", "best_practices")}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
