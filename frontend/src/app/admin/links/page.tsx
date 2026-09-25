'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/admin/links`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch links. You might not have permission.');
      }

      const data = await res.json();
      setLinks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [router]);

  const handleDeleteLink = async (linkId: number, shortCode: string) => {
    if (!confirm(`Are you sure you want to delete link /${shortCode}? This will break any existing QR codes or shares.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      
      const res = await fetch(`${backendUrl}/api/admin/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to delete link");
      }

      fetchLinks();
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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Link Management</h2>
        <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm">{links.length} Links</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-4 pl-6 w-48">Short Code</th>
              <th className="p-4 w-64 max-w-[16rem]">Original URL</th>
              <th className="p-4">Owner</th>
              <th className="p-4 text-center">Clicks</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 font-bold text-gray-900">/{link.short_code}</td>
                <td className="p-4 text-gray-600 truncate max-w-[16rem]" title={link.original_url}>
                  {link.original_url}
                </td>
                <td className="p-4 font-medium text-gray-700">{link.owner_email}</td>
                <td className="p-4 text-center">
                  <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full font-bold text-xs">{link.clicks}</span>
                </td>
                <td className="p-4 text-gray-500">{new Date(link.created_at).toLocaleDateString()}</td>
                <td className="p-4 pr-6 text-right">
                  <button 
                    onClick={() => handleDeleteLink(link.id, link.short_code)}
                    className="text-red-600 hover:text-red-900 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
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
