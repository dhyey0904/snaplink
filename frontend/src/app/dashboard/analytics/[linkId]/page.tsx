"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

type AnalyticsData = {
  link_id: number;
  total_clicks: number;
  browsers: Record<string, number>;
  devices: Record<string, number>;
  referrers: Record<string, number>;
  daily_clicks: { date: string, clicks: number }[];
};

export default function AnalyticsDashboard() {
  const { linkId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetchAPI(`/analytics/${linkId}`)
      .then(setData)
      .catch((err) => {
        console.error(err);
        alert("Failed to load analytics or link not found");
        router.push("/dashboard/links");
      })
      .finally(() => setLoading(false));
  }, [linkId, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>;
  }

  if (!data) return null;

  // Format data for Recharts
  const deviceData = Object.entries(data.devices).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(data.browsers).map(([name, value]) => ({ name, value }));
  const referrerData = Object.entries(data.referrers).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9333ea'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-12">
      {/* Navbar */}
      <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:h-16 sm:items-center py-3 sm:py-0">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/dashboard/links")} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <h1 className="text-xl font-bold text-[#202124]">Link Analytics</h1>
            </div>
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <span className="text-sm font-semibold text-blue-700">ID: {linkId}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-sm font-medium text-[#5f6368] mb-2">Total Clicks</h3>
            <div className="text-4xl font-extrabold text-[#1a73e8]">{data.total_clicks}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-sm font-medium text-[#5f6368] mb-2">Top Device</h3>
            <div className="text-2xl font-bold text-[#202124]">{deviceData.length > 0 ? deviceData.sort((a, b) => b.value - a.value)[0].name : "N/A"}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-sm font-medium text-[#5f6368] mb-2">Top Referrer</h3>
            <div className="text-2xl font-bold text-[#202124]">{referrerData.length > 0 ? referrerData[0].name : "N/A"}</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm mb-8">
          <h3 className="text-lg font-bold text-[#202124] mb-6">Traffic Over Time (Last 30 Days)</h3>
          <div className="h-[300px] w-full">
            {data.daily_clicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.daily_clicks}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 12}} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="clicks" stroke="#1a73e8" strokeWidth={3} dot={{r: 4, fill: '#1a73e8', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#5f6368]">Not enough data to display chart.</div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-lg font-bold text-[#202124] mb-6">Top Referrers</h3>
            {referrerData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referrerData} layout="vertical" margin={{top: 0, right: 0, left: 20, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f3f4" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#202124', fontSize: 13, fontWeight: 500}} width={100} />
                    <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {referrerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-[#5f6368]">No referrer data available.</div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-lg font-bold text-[#202124] mb-6">Devices & Browsers</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[#5f6368] uppercase tracking-wider mb-3">By Device</h4>
                <div className="space-y-3">
                  {deviceData.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-24 text-sm font-medium text-[#202124]">{item.name}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.value / data.total_clicks) * 100}%` }}></div>
                      </div>
                      <div className="w-12 text-right text-sm text-[#5f6368]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-[#5f6368] uppercase tracking-wider mb-3">By Browser</h4>
                <div className="space-y-3">
                  {browserData.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-24 text-sm font-medium text-[#202124]">{item.name}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(item.value / data.total_clicks) * 100}%` }}></div>
                      </div>
                      <div className="w-12 text-right text-sm text-[#5f6368]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
