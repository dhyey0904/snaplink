'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

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

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
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

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm('Are you sure you want to dismiss this report?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
      
      const res = await fetch(`${backendUrl}/api/admin/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete report");
      
      // Refresh stats
      fetchStats();
    } catch (err) {
      alert("Error deleting report");
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a73e8]"></div></div>;
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/dashboard" className="px-6 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-blue-600 transition-colors">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
            <p className="text-gray-500 mt-1">Live metrics from your production database.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">👥</div>
              <h3 className="text-gray-500 font-medium">Total Users</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_users.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl">🔗</div>
              <h3 className="text-gray-500 font-medium">Links Created</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_links.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl">📱</div>
              <h3 className="text-gray-500 font-medium">Bio Pages</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_bios.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-xl">🖱️</div>
              <h3 className="text-gray-500 font-medium">Total Clicks</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_clicks.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">⭐</div>
              <h3 className="text-gray-500 font-medium">Pro Users</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.pro_users.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-red-50 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">🚩</div>
              <h3 className="text-gray-500 font-medium">Abuse Reports</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_reports.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-green-500 shadow-sm relative overflow-hidden md:col-span-2 lg:col-span-2">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">💰</div>
              <h3 className="text-gray-700 font-medium">Total Revenue (INR)</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 relative z-10">₹{stats?.revenue_inr.toLocaleString()}</div>
          </div>

        </div>

        {/* Abuse Reports Section */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Abuse Reports</h2>
            <p className="text-gray-500 text-sm mt-1">Review and manage reported URLs.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          {stats?.recent_reports && stats.recent_reports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600 text-sm">URL</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Reason</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Details</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_reports.map((report: any) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <a href={report.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium break-all">
                          {report.url}
                        </a>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                          {report.reason}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                        {report.details || '—'}
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-gray-400 hover:text-green-600 transition-colors p-2"
                          title="Dismiss / Resolve"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">🎉</div>
              <p>No abuse reports found. The platform is clean!</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
