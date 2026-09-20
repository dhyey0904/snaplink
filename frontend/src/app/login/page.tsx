"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("username", formData.email);
      formBody.append("password", formData.password);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
      const data = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!data.ok) {
        const err = await data.json();
        throw new Error(err.detail || "Login failed");
      }

      const result = await data.json();
      localStorage.setItem("token", result.access_token);
      setSuccess("Login successful!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError("");
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
      const response = await fetch(`${backendUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Google login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setSuccess("Login successful!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Beautiful Animated Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: "8s" }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: "10s" }}></div>
      <div className="absolute top-[40%] left-[20%] w-[40vw] h-[40vw] bg-pink-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: "12s" }}></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full mix-blend-screen filter blur-md animate-bounce opacity-60" style={{ animationDuration: "4s" }}></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full mix-blend-screen filter blur-md animate-bounce opacity-60" style={{ animationDuration: "5s" }}></div>

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md relative z-10 perspective-1000">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transform transition-transform duration-500 hover:scale-[1.01]">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
              Snap<span className="text-[#3b82f6]">Link</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-white/70 font-medium text-sm">Access your digital hub and secure files.</p>
          </div>

          <div className="mb-6 w-full flex justify-center">
             <div className="overflow-hidden rounded-xl border border-white/20 hover:border-white/50 transition-colors shadow-lg bg-white/5 backdrop-blur-sm">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                  theme="filled_black"
                  shape="rectangular"
                  size="large"
                />
             </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-transparent px-4 text-white/50 font-bold uppercase tracking-widest backdrop-blur-md rounded-full">Or continue with email</span>
            </div>
          </div>

          {success && <div className="text-green-400 text-sm font-bold p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center gap-2 mb-6"><svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{success}</div>}
          {error && <div className="text-red-400 text-sm font-bold p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 mb-6"><svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            
                  
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl text-base font-bold text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-2"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : null}
              {loading ? "Authenticating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-white/70">
            <Link href="/login" className="text-white hover:text-blue-300 transition-colors hover:underline">
              Already have an account? Sign in
            </Link>
          </p>
          
        </div>
      </div>
      
      {/* Bottom branding */}
      <div className="absolute bottom-6 w-full text-center z-0 opacity-40">
        <p className="text-xs font-bold text-white tracking-widest uppercase">Secure authentication by SnapLink</p>
      </div>

    </div>
  );
}
