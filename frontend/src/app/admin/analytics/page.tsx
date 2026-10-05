"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Users, Link as LinkIcon, Globe, Monitor, Compass, MapPin } from 'lucide-react';

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
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          Loading rich analytics...
        </div>
      </div>
    );
  }

  if (!data) return null;

  const BreakdownCard = ({ title, icon: Icon, items, colorClass }: { title: string, icon: any, items: any[], colorClass: string }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
        <Icon size={18} className="text-gray-500" />
        <h3 className="text-gray-900 font-bold">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100 p-2">
        {items.length === 0 ? (
          <div className="p-4 md:p-6 text-center text-gray-400 text-sm">No data available</div>
        ) : (
          items.map((item: any, i: number) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors group">
              <span className="font-semibold text-gray-700 text-sm truncate max-w-[150px] group-hover:text-gray-900">{item.name}</span>
              <div className="flex items-center gap-4">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${item.pct}%` }}></div>
                </div>
                <span className="font-mono font-bold text-gray-900 text-sm w-8 text-right">{item.count}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Analytics</h2>
          <p className="text-gray-500 mt-1">Real-time performance and demographic insights.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-1 flex text-sm font-medium shadow-sm">
          <button className="px-4 py-2 rounded-md bg-blue-50 text-blue-700 font-bold shadow-sm border border-blue-100">Last 7 Days</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" /> Total Global Clicks
          </div>
          <div className="text-4xl font-black text-gray-900">{(data?.overview?.total_clicks || data?.total_clicks || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Users size={16} className="text-green-500" /> Registered Users
          </div>
          <div className="text-4xl font-black text-gray-900">{(data?.overview?.total_users || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <LinkIcon size={16} className="text-purple-500" /> Short Links Created
          </div>
          <div className="text-4xl font-black text-gray-900">{(data?.overview?.total_links || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
          <Activity size={18} className="text-blue-500"/>
          7-Day Trailing Engagement
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.daily_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
                labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
              />
              <Area type="monotone" name="Clicks" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              <Line type="monotone" name="New Links" dataKey="links" stroke="#a855f7" strokeWidth={2} dot={false} />
              <Line type="monotone" name="New Users" dataKey="users" stroke="#22c55e" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BreakdownCard title="Traffic Sources" icon={Globe} items={data.top_sources || []} colorClass="bg-blue-500" />
        <BreakdownCard title="Geographic" icon={MapPin} items={data.top_countries || []} colorClass="bg-purple-500" />
        <BreakdownCard title="Devices" icon={Monitor} items={data.top_devices || []} colorClass="bg-green-500" />
        <BreakdownCard title="Browsers" icon={Compass} items={data.top_browsers || []} colorClass="bg-orange-500" />
      </div>

    </div>
  );
}
