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
    <div className="bg-[#18181B] rounded-xl border border-[#27272A] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#27272A] bg-[#18181B] flex justify-between items-center">
        <h2 className="text-sm font-semibold text-[#F4F4F5] flex items-center gap-2">
          <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          Active Links
        </h2>
        <span className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-mono px-2 py-0.5 rounded text-xs">{links.length} ACTIVE</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#09090B] text-[#A1A1AA] text-[10px] uppercase tracking-wider font-mono border-b border-[#27272A]">
              <th className="p-4 pl-5 w-48">Short Code</th>
              <th className="p-4 w-64 max-w-[16rem]">Target URL</th>
              <th className="p-4">Owner</th>
              <th className="p-4 text-center">Clicks</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A] text-sm">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-[#27272A]/30 transition-colors group">
                <td className="p-4 pl-5 font-mono text-[#F4F4F5] text-xs">/{link.short_code}</td>
                <td className="p-4 text-[#A1A1AA] truncate max-w-[16rem] font-mono text-xs" title={link.original_url}>
                  {link.original_url}
                </td>
                <td className="p-4 font-medium text-[#F4F4F5]">{link.owner_email}</td>
                <td className="p-4 text-center">
                  <span className="bg-[#27272A] text-[#F4F4F5] px-2 py-0.5 rounded border border-[#3F3F46] font-mono text-[10px]">{link.clicks}</span>
                </td>
                <td className="p-4 text-[#A1A1AA] font-mono text-xs">{new Date(link.created_at).toISOString().split('T')[0]}</td>
                <td className="p-4 pr-5 text-right">
                  <button 
                    onClick={() => handleDeleteLink(link.id, link.short_code)}
                    className="text-[#EF4444] hover:text-white font-semibold bg-[#EF4444]/10 hover:bg-[#EF4444] border border-[#EF4444]/20 px-3 py-1 rounded transition-all text-xs opacity-0 group-hover:opacity-100"
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
