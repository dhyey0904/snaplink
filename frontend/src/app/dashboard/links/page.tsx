"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";

const SHORT_LINK_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/` : "http://127.0.0.1:8000/";

type LinkData = {
  id: number;
  original_url: string;
  short_code: string;
  custom_alias: string | null;
  is_active: boolean;
  has_password: boolean;
};

export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // QR Modal State
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  // Ad Modal States
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadLinks = async () => {
      try {
        const data = await fetchAPI("/links/");
        setLinks(data);
      } catch (err) {
        console.error(err);
        if ((err as Error).message.includes("validate credentials")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, [router]);

  useEffect(() => {
    if (showAdModal && adCountdown > 0) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showAdModal && adCountdown === 0 && !isCreating) {
      executeCreateLink();
    }
  }, [showAdModal, adCountdown]);

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAlias(e.target.value);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAlias) {
      alert("You must provide a custom short code.");
      return;
    }
    setShowAdModal(true);
    setAdCountdown(5);
  };

  const executeCreateLink = async () => {
    setIsCreating(true);
    try {
      const data = await fetchAPI("/links/", {
        method: "POST",
        body: JSON.stringify({ 
          original_url: newUrl,
          custom_alias: customAlias,
          password: password || null
        }),
      });
      setLinks([...links, data]);
      setNewUrl("");
      setCustomAlias("");
      setPassword("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreating(false);
      setShowAdModal(false);
    }
  };

  const handleEdit = async (id: number, oldUrl: string) => {
    const newDest = prompt("Enter the new Original URL:", oldUrl);
    if (!newDest) return; 
    
    const newPassword = prompt("Set a new Password for this link?\n(Leave blank to keep current, or type 'REMOVE' to delete the password)");
    
    const payload: any = {};
    if (newDest !== oldUrl) payload.original_url = newDest;
    if (newPassword) payload.password = newPassword;

    if (Object.keys(payload).length === 0) return;

    try {
      const data = await fetchAPI(`/links/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setLinks(links.map(link => link.id === id ? data : link));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    
    try {
      await fetchAPI(`/links/${id}`, { method: "DELETE" });
      setLinks(links.filter(link => link.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleCopy = (shortCode: string, id: number) => {
    const fullUrl = `${SHORT_LINK_DOMAIN}${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadQR = async () => {
    if (!qrModalUrl) return;
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrModalUrl)}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      // Extract the short code for the filename
      const shortCode = qrModalUrl.split('/').pop() || 'link';
      link.download = `snaplink-qr-${shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Failed to download automatically. You can always right-click the image to save it!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Snap<span className="text-blue-600">Link</span> Dashboard</h1>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Link-in-Bio
          </Link>
          <Link href="/dashboard/api" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
            API Access
          </Link>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 font-medium">Logout</button>
        </div>
      </nav>

      {/* Main Content Side-by-Side */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full flex flex-col lg:flex-row gap-8">
        {/* Create Link Section - Left Side */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Create New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Original Destination URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/long-url..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Custom Short Link <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={customAlias}
                  onChange={handleAliasChange}
                  placeholder="my-custom-url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password (Optional)</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank for public"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm"
                />
              </div>
              
              <button type="submit" className="w-full py-2.5 mt-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 shadow-sm transition-colors">
                Generate Link
              </button>
            </form>
          </div>
        </div>

        {/* Links List - Right Side */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Short Link</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Original URL</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {links.map((link) => {
                  const shortCode = link.custom_alias || link.short_code;
                  const fullShortUrl = `${SHORT_LINK_DOMAIN}${shortCode}`;
                  
                  return (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={fullShortUrl} 
                          target="_blank" 
                          className="text-gray-900 hover:text-blue-600 font-semibold transition-colors"
                        >
                          {shortCode}
                        </a>
                        {link.has_password && <span className="ml-2 text-xs text-gray-400" title="Password Protected">🔒</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={link.original_url}>
                        {link.original_url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md ${link.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {link.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button 
                          onClick={() => handleCopy(shortCode, link.id)}
                          className={`${copiedId === link.id ? 'text-green-600' : 'text-gray-400 hover:text-gray-900'} transition-colors inline-block`}
                        >
                          {copiedId === link.id ? 'Copied ✓' : 'Copy'}
                        </button>
                        <button 
                          onClick={() => setQrModalUrl(fullShortUrl)}
                          className="text-gray-400 hover:text-blue-600 transition-colors inline-block"
                        >
                          QR
                        </button>
                        <button 
                          onClick={() => handleEdit(link.id, link.original_url)}
                          className="text-gray-400 hover:text-blue-600 transition-colors inline-block"
                        >
                          Edit
                        </button>
                        <a href={`/analytics/${link.id}`} className="text-gray-400 hover:text-purple-600 transition-colors inline-block">
                          Stats
                        </a>
                        <button 
                          onClick={() => handleDelete(link.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors inline-block"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {links.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                      You haven&apos;t created any links yet. Build your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SnapLink. All rights reserved.</p>
        </div>
      </footer>

      {/* QR Code Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setQrModalUrl(null)}>
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Your QR Code</h3>
            <p className="text-gray-500 text-sm mb-6">Scan this to visit your short link</p>
            <div className="bg-white p-4 border border-gray-200 rounded-lg mb-6 shadow-sm">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalUrl)}`} alt="QR Code" width="200" height="200" />
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <button onClick={handleDownloadQR} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors w-full shadow-sm">
                Download High-Res PNG
              </button>
              <button onClick={() => setQrModalUrl(null)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors w-full">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Generating your short link...</h3>
              <span className="text-sm font-medium text-gray-500">Advertisement</span>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-gray-100">
              {/* Fake Ad Container */}
              <div className="w-full max-w-[300px] h-[250px] bg-gray-300 border border-gray-400 flex items-center justify-center mb-6 shadow-sm">
                <span className="text-gray-500 font-bold">Ad Space (300x250)</span>
              </div>

              <div className="text-center">
                {adCountdown > 0 ? (
                  <p className="text-lg font-medium text-gray-700">
                    Your link will be ready in <span className="text-3xl font-extrabold text-blue-600 mx-2">{adCountdown}</span> seconds
                  </p>
                ) : (
                  <p className="text-xl font-bold text-green-600">Finalizing link...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
