"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
      const res = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }
      setMessage(data.message || "Success! Reset link sent.");
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans bg-[#0a0a0a]">
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="w-full max-w-md relative z-10 perspective-1000">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="flex justify-center mb-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
              Snap<span className="text-[#3b82f6]">Link</span>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-2">Reset Password</h2>
            <p className="text-white/70 font-medium text-sm">Enter your email to receive a secure reset link.</p>
          </div>

          {message && <div className="text-green-400 text-sm font-bold p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center mb-6">{message}</div>}
          {error && <div className="text-red-400 text-sm font-bold p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5 ml-1">Email Address</label>
              <input type="email" required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl text-base font-bold text-gray-900 bg-white hover:bg-gray-100 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-2">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-white/70">
            <Link href="/login" className="text-white hover:text-blue-300 transition-colors hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
