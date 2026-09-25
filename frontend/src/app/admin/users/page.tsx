'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users. You might not have permission.');
      }

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const handleDeleteUser = async (userId: number, email: string) => {
    if (!confirm(`Are you absolutely sure you want to delete user ${email}? This cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      
      const res = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to delete user");
      }

      // Refresh list
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          User Registry
        </h2>
        <span className="bg-blue-50 border border-blue-100 text-blue-600 font-mono px-2 py-0.5 rounded text-xs">{users.length} TOTAL</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 text-[10px] uppercase tracking-wider font-mono border-b border-gray-100">
              <th className="p-4 pl-5">UID</th>
              <th className="p-4">Email</th>
              <th className="p-4">Tier</th>
              <th className="p-4 text-center">Links</th>
              <th className="p-4">Registered</th>
              <th className="p-4 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((user) => (
               <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4 pl-5 text-gray-400 font-mono text-xs">{user.id.toString().padStart(4, '0')}</td>
                <td className="p-4 font-medium text-gray-900">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 border rounded text-[10px] uppercase font-mono tracking-wider ${
                    user.tier === 'pro' 
                    ? 'bg-purple-50 text-purple-600 border-purple-100' 
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                    {user.tier === 'pro' ? 'PRO' : 'FREE'}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-center font-mono">{user.link_count}</td>
                <td className="p-4 text-gray-400 font-mono text-xs">{new Date(user.created_at).toISOString().split('T')[0]}</td>
                <td className="p-4 pr-5 text-right">
                  <button 
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    className="text-red-600 hover:text-red-700 font-semibold bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1 rounded transition-all text-xs opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    Terminate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
