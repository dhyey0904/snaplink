'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminFilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/admin/files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch files. You might not have permission.');
      }

      const data = await res.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [router]);

  const handleDeleteFile = async (fileId: number, filename: string) => {
    if (!confirm(`Are you sure you want to completely delete "${filename}" from the server?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      
      const res = await fetch(`${backendUrl}/api/admin/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to delete file");
      }

      fetchFiles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const totalSize = files.reduce((acc, file) => acc + (file.size_bytes || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl z-0"></div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            System Storage Consumed
          </p>
          <h3 className="text-3xl font-bold text-gray-900">{formatBytes(totalSize)}</h3>
        </div>
        <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center border border-gray-200 relative z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-900">Allocated Files</h2>
          <span className="bg-blue-50 border border-blue-100 text-blue-600 font-mono px-2 py-0.5 rounded text-xs">{files.length} ITEMS</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[10px] uppercase tracking-wider font-mono border-b border-gray-100">
                <th className="p-4 pl-5">Filename</th>
                <th className="p-4">Size</th>
                <th className="p-4">Owner</th>
                <th className="p-4 text-center">Downloads</th>
                <th className="p-4">Expires</th>
                <th className="p-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 pl-5 font-medium text-gray-900 truncate max-w-[12rem] text-xs" title={file.filename}>
                    {file.filename}
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">
                    {formatBytes(file.size_bytes || 0)}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{file.owner_email}</td>
                  <td className="p-4 text-center">
                    <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono text-[10px]">{file.downloads || 0}</span>
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-xs">
                    {file.expires_at ? new Date(file.expires_at).toISOString().split('T')[0] : 'NEVER'}
                  </td>
                  <td className="p-4 pr-5 text-right">
                    <button 
                      onClick={() => handleDeleteFile(file.id, file.filename)}
                      className="text-red-600 hover:text-red-700 font-semibold bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1 rounded transition-all text-xs opacity-0 group-hover:opacity-100 shadow-sm"
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
    </div>
  );
}
