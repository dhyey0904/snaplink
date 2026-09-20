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
    <div className="flex min-h-[100dvh] overflow-y-auto lg:h-screen lg:overflow-hidden w-full bg-white font-sans">
      
      {/* LEFT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-32 py-10 lg:py-0 relative z-10 bg-white shadow-[20px_0_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 font-medium mb-6 text-sm">Enter your details to access your account.</p>

          <div className="mb-4 w-full flex justify-center transform hover:scale-[1.02] transition-transform">
             <div className="overflow-hidden rounded-xl border border-gray-100 hover:border-[#1a73e8] transition-colors shadow-sm">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                />
             </div>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-wider">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#1a73e8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 transition-all text-gray-900 font-medium placeholder-gray-400 text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#1a73e8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 transition-all text-gray-900 font-medium placeholder-gray-400 text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end pb-1">
              <Link href="/forgot-password" className="text-xs font-bold text-[#1a73e8] hover:underline">Forgot password?</Link>
            </div>

            {success && <div className="text-green-600 text-xs font-bold p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2"><svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{success}</div>}
            {error && <div className="text-red-500 text-xs font-bold p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"><svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white font-bold text-sm bg-[#1a73e8] hover:bg-[#1557b0] transition-all duration-200 shadow-sm hover:shadow mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {loading ? "Authenticating..." : "Continue to SnapLink"}
                {!loading && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
              </span>
            </button>
          </form>

          <p className="mt-5 text-center text-gray-500 font-medium text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#1a73e8] hover:underline font-bold transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Branding & Visuals (Wow Moment) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#1a73e8] via-[#0d47a1] to-black flex-col justify-between p-12 overflow-hidden">
        
        {/* SnapLink Logo - Flex positioned to avoid overlap */}
        <div className="z-20 w-full">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-white inline-block hover:scale-105 transition-transform origin-left drop-shadow-md">
            Snap<span className="text-blue-300">Link</span>
          </Link>
        </div>

        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-white opacity-10 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-purple-500 opacity-20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* 3D Glassmorphic Container (Shrunk to fit safely) */}
        <div className="relative z-10 w-full max-w-sm mx-auto perspective-1000 mt-[-40px]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
            
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 border border-white/30 shadow-inner">
              <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            
            <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight drop-shadow-sm">Unleash your digital<br/>potential.</h3>
            
            <p className="text-blue-100 text-sm leading-relaxed mb-8 font-medium">
              "Switching to SnapLink was the best decision for our team. The 1GB ephemeral file sharing and stunning 3D vCards have completely elevated our brand."
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-400 to-blue-300 border-2 border-white shadow-lg"></div>
              <div>
                <div className="text-white font-bold text-base">Dhyey Raja</div>
                <div className="text-blue-200 font-medium text-xs">Founder, SnapLink</div>
              </div>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full mix-blend-screen filter blur-md animate-bounce shadow-2xl" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-16 h-16 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full mix-blend-screen filter blur-md animate-bounce shadow-2xl" style={{ animationDuration: '4s' }}></div>
        </div>

        {/* Bottom Spacer to balance flex-col */}
        <div className="h-8 w-full z-10"></div>
      </div>
    </div>
  );
}
