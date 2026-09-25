"use client";
import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { fetchAPI } from "@/utils/api";

export default function QuickLinkWidget() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const shorten = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetchAPI("/links", {
        method: "POST",
        body: JSON.stringify({ original_url: url }),
      });
      if (res.short_url) {
        setResult(res.short_url);
        setUrl("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to shorten link");
    } finally {
      setLoading(false);
    }
  };

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full justify-center">
      {!result ? (
        <form onSubmit={shorten} className="flex gap-2 w-full mt-2">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Paste long URL..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-amber-400 w-full"
          />
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => e.stopPropagation()}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Go"}
          </button>
        </form>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex flex-col gap-2 w-full mt-2">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Ready to share</p>
          <a href={result} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-sm font-medium text-amber-700 truncate">
            {result.replace("https://", "")}
          </a>
          <div className="flex gap-2 mt-2">
            <button onClick={copy} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-1.5 rounded flex items-center justify-center gap-1 border border-amber-200 shadow-sm transition-colors">
              {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>} 
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setResult(""); }} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-1.5 rounded border border-amber-200 shadow-sm transition-colors">
              New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
