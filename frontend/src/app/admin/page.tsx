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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Total Users
            </p>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.total_users?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-green-600 relative z-10">
            <span className="bg-green-50 px-2 py-0.5 rounded border border-green-100">+{stats?.pro_users || 0} PRO</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              Links Created
            </p>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.total_links?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-blue-600 relative z-10">
            <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{stats?.total_bios || 0} BIO PAGES</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
              Network Clicks
            </p>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.total_clicks?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-gray-500 relative z-10">
            <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">ALL DOMAINS</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Platform Revenue
            </p>
            <h3 className="text-3xl font-bold text-gray-900">₹{stats?.revenue_inr?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-green-600 relative z-10">
            <span className="bg-green-50 px-2 py-0.5 rounded border border-green-100">+12% THIS MONTH</span>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span>
            Active Reports ({stats?.total_reports || 0})
          </h2>
        </div>
        
        {stats?.recent_reports?.length === 0 ? (
          <div className="p-10 text-center text-gray-400 font-medium text-sm">
            <svg className="w-10 h-10 mx-auto text-green-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            System logs clear. No active abuse reports.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats?.recent_reports?.map((report: any) => (
              <div key={report.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 text-[10px] uppercase font-mono tracking-wider rounded mb-2">TARGET LINK: {report.link_id}</span>
                    <p className="text-gray-900 text-sm">{report.reason}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{report.email} • {new Date(report.created_at).toISOString()}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-colors border border-gray-200 shadow-sm">
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
