"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Page() {
  const [url, setUrl] = useState('');
  const [reason, setReason] = useState('Phishing / Scam');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In development, the backend is on localhost:8000. In production it would be an env var
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
      
      const res = await fetch(`${backendUrl}/api/report/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, reason, details })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Failed to submit report");
      }
      
      setSuccess(true);
      setUrl('');
      setDetails('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-4xl md:text-5xl font-black text-[#202124] tracking-tight mb-8">Report Abuse</h1>
        <div className="prose prose-lg prose-blue max-w-none text-[#5f6368]">
          <p className="text-xl mb-6">We take platform abuse very seriously. If you have discovered a SnapLink URL that redirects to malware, phishing, or illegal content, please report it immediately.</p>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h3>
                <p className="text-gray-500 mb-6">Thank you for helping keep SnapLink safe. Our trust and safety team will review this link shortly.</p>
                <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {error && <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium">{error}</div>}
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Offending SnapLink URL</label>
                  <input 
                    type="url" 
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://snaplink.com/xYz123" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Reporting</label>
                  <select 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                  >
                    <option>Phishing / Scam</option>
                    <option>Malware / Virus</option>
                    <option>Spam</option>
                    <option>Illegal Content</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Additional Details</label>
                  <textarea 
                    rows={4} 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="Please provide any context..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors self-start shadow-md flex items-center gap-2"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
