"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-sans">
      <div className="max-w-[450px] w-full space-y-8 p-10 bg-white rounded-3xl border border-[#dadce0]">
        <div className="text-center">
          <h2 className="text-2xl font-normal text-[#202124]">Create a SnapLink Account</h2>
          <p className="mt-2 text-base text-[#5f6368]">Enter your details to continue</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-[#d93025] text-sm text-center bg-[#fce8e6] p-3 rounded-lg flex items-center justify-center gap-2">⚠️ {error}</div>}
          <div className="space-y-5">
            <div>
              <input
                type="text"
                required
                placeholder="Full Name"
                className="block w-full px-4 py-4 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] text-base placeholder-[#5f6368] transition-shadow"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <input
                type="email"
                required
                placeholder="Email address"
                className="block w-full px-4 py-4 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] text-base placeholder-[#5f6368] transition-shadow"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                required
                placeholder="Password"
                className="block w-full px-4 py-4 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] text-base placeholder-[#5f6368] transition-shadow"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Link href="/login" className="font-medium text-[#1a73e8] hover:text-[#174ea6] transition-colors text-sm">
              Sign in instead
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-full font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] focus:outline-none focus:ring-4 focus:ring-[#1a73e8]/20 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Next"}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dadce0]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#5f6368]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return;
                try {
                  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
                  const data = await fetch(`${backendUrl}/api/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: credentialResponse.credential }),
                  });
                  if (!data.ok) throw new Error("Google login failed");
                  
                  const result = await data.json();
                  localStorage.setItem("token", result.access_token);
                  router.push("/dashboard");
                } catch (err: any) {
                  setError(err.message);
                }
              }}
              onError={() => setError("Google Login Failed")}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
