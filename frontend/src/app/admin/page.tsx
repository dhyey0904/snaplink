'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch admin stats. You might not have permission.');
      }

      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a73e8]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-lg mb-2">Access Denied</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
            <h3 className="text-4xl font-black text-gray-900">{stats?.total_users?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-blue-600 relative z-10">
            <span className="bg-blue-100 px-2 py-1 rounded-md">{stats?.pro_users || 0} Pro Users</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Links</p>
            <h3 className="text-4xl font-black text-gray-900">{stats?.total_links?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 relative z-10">
            <span className="bg-indigo-100 px-2 py-1 rounded-md">{stats?.total_bios || 0} Bio Pages</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-pink-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Clicks</p>
            <h3 className="text-4xl font-black text-gray-900">{stats?.total_clicks?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-pink-600 relative z-10">
            <span className="bg-pink-100 px-2 py-1 rounded-md">Across all links</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Revenue</p>
            <h3 className="text-4xl font-black text-gray-900">₹{stats?.revenue_inr?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-green-600 relative z-10">
            <span className="bg-green-100 px-2 py-1 rounded-md">Lifetime</span>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Reports ({stats?.total_reports || 0})</h2>
        </div>
        
        {stats?.recent_reports?.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium">
            <svg className="w-12 h-12 mx-auto text-green-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            No active reports! Everything looks good.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats?.recent_reports?.map((report: any) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md mb-2">Reported Link ID: {report.link_id}</span>
                    <p className="text-gray-800 font-medium">{report.reason}</p>
                    <p className="text-sm text-gray-500 mt-1">From: {report.email} • {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
