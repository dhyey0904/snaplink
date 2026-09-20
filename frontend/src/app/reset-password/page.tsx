"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to reset password.");
      
      setMessage("Password successfully reset! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans bg-[#0a0a0a]">
      <div className="absolute top-[40%] left-[20%] w-[40vw] h-[40vw] bg-pink-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>

      <div className="w-full max-w-md relative z-10 perspective-1000">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="flex justify-center mb-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
              Snap<span className="text-[#3b82f6]">Link</span>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-2">Create New Password</h2>
            <p className="text-white/70 font-medium text-sm">Enter a new secure password for your account.</p>
          </div>

          {message && <div className="text-green-400 text-sm font-bold p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center mb-6">{message}</div>}
          {error && <div className="text-red-400 text-sm font-bold p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5 ml-1">New Password</label>
              <input type="password" required className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" disabled={loading || !token} className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl text-base font-bold text-gray-900 bg-white hover:bg-gray-100 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-2">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
