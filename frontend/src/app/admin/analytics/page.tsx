"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('snaplink_token') || localStorage.getItem('token');
      if (!token) return router.push('/login');

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading analytics...</div>;
  }

  if (!data) return null;

  const maxClicks = Math.max(...data.daily_data.map((d: any) => d.count), 1); // Avoid div by 0

  return (
    <div className="space-y-6 max-w-6xl">
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-1 flex text-sm font-medium shadow-sm">
          <button className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-900">7D</button>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Total Link Clicks</h3>
          <p className="text-3xl font-black text-gray-900 flex items-center gap-2">
            {data.total_clicks.toLocaleString()}
          </p>
        </div>

        <div className="h-64 flex items-end gap-4 pb-4">
          {data.daily_data.map((val: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="w-full relative bg-gray-50 rounded-t-lg transition-all duration-300 overflow-hidden h-full flex items-end">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg group-hover:bg-blue-600 transition-all duration-500 relative"
                  style={{ height: `${(val.count / maxClicks) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900">{val.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Referrers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-gray-900 font-bold">Top Traffic Sources</h3>
          </div>
          <div className="divide-y divide-gray-100 p-2">
            {data.top_sources.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No traffic data yet.</div>
            ) : (
              data.top_sources.map((item: any, i: number) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-semibold text-gray-700 text-sm truncate max-w-[150px]">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.pct}%` }}></div>
                    </div>
                    <span className="font-mono font-bold text-gray-900 text-sm">{item.count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
