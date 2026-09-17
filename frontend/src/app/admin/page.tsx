'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
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

    fetchStats();
  }, [router]);

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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                SnapLink <span className="text-[#ea4335]">Admin</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Exit Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
            <p className="text-gray-500 mt-1">Live metrics from your production database.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
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
              <h3 className="text-gray-500 font-medium">Bio Pages Created</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_bios.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-xl">🖱️</div>
              <h3 className="text-gray-500 font-medium">Total Clicks Processed</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.total_clicks.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">⭐</div>
              <h3 className="text-gray-500 font-medium">Pro Users (API)</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900">{stats?.pro_users.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-green-500 shadow-sm relative overflow-hidden">
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
      </main>
    </div>
  );
}
