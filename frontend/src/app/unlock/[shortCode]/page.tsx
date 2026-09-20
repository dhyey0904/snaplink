"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function UnlockPage() {
  const { shortCode } = useParams();
  const [password, setPassword] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      window.location.href = `${backendUrl}/${shortCode}?pwd=${encodeURIComponent(password)}`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Protected Link</h2>
        <p className="text-gray-600 mb-6">This link requires a password to access.</p>
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-center"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Unlock & Redirect
          </button>
        </form>
      </div>
    </div>
  );
}
