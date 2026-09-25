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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          Active Links
        </h2>
        <span className="bg-green-50 border border-green-100 text-green-600 font-mono px-2 py-0.5 rounded text-xs">{links.length} ACTIVE</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 text-[10px] uppercase tracking-wider font-mono border-b border-gray-100">
              <th className="p-4 pl-5 w-48">Short Code</th>
              <th className="p-4 w-64 max-w-[16rem]">Target URL</th>
              <th className="p-4">Owner</th>
              <th className="p-4 text-center">Clicks</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4 pl-5 font-mono text-gray-900 text-xs">/{link.short_code}</td>
                <td className="p-4 text-gray-500 truncate max-w-[16rem] font-mono text-xs" title={link.original_url}>
                  {link.original_url}
                </td>
                <td className="p-4 font-medium text-gray-900">{link.owner_email}</td>
                <td className="p-4 text-center">
                  <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono text-[10px]">{link.clicks}</span>
                </td>
                <td className="p-4 text-gray-400 font-mono text-xs">{new Date(link.created_at).toISOString().split('T')[0]}</td>
                <td className="p-4 pr-5 text-right">
                  <button 
                    onClick={() => handleDeleteLink(link.id, link.short_code)}
                    className="text-red-600 hover:text-red-700 font-semibold bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1 rounded transition-all text-xs opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    Purge
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
