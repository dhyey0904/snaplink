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
  expires_at?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
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
          password: password || null,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
          og_title: ogTitle || null,
          og_description: ogDescription || null,
          og_image: ogImage || null
        }),
      });
      setLinks([...links, data]);
      setNewUrl("");
      setCustomAlias("");
      setPassword("");
      setExpiresAt("");
      setOgTitle("");
      setOgDescription("");
      setOgImage("");
      setShowAdvanced(false);
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-[#202124]">
                Snap<span className="text-[#1a73e8]">Link</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                Link-in-Bio
              </Link>
              <Link href="/dashboard/links" className="text-sm font-medium text-[#1a73e8] border-b-2 border-[#1a73e8] py-5">
                URL Shortener
              </Link>
              <Link href="/dashboard/api" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                API Access
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-[#5f6368] hover:text-[#d93025] transition-colors ml-4">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Side-by-Side */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col lg:flex-row gap-8">
        {/* Create Link Section - Left Side */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-3xl border border-[#dadce0] sticky top-24">
            <h2 className="text-lg font-medium text-[#202124] mb-4">Create New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1.5">Original Destination URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/long-url..."
                  className="block w-full px-3 py-2 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow placeholder-[#5f6368]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1.5">Custom Short Link <span className="text-[#d93025]">*</span></label>
                <input
                  type="text"
                  required
                  value={customAlias}
                  onChange={handleAliasChange}
                  placeholder="my-custom-url"
                  className="block w-full px-3 py-2 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow placeholder-[#5f6368]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1.5">Password <span className="text-[#5f6368] font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank for public link"
                  className="block w-full px-3 py-2 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow placeholder-[#5f6368]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#202124] mb-1.5">Expiration Date <span className="text-[#5f6368] font-normal">(Optional)</span></label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow"
                />
              </div>

              {/* Social Media Preview Toggle */}
              <div className="pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between w-full p-4 bg-[#f8f9fa] hover:bg-gray-100 rounded-xl transition-all border border-gray-200 shadow-sm text-left gap-3"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-[#202124] flex items-center gap-2 text-base">
                      🖼️ Customize Social Media Preview
                    </span>
                    <span className="text-xs sm:text-sm text-[#5f6368] mt-1 leading-relaxed">
                      Change how this link looks when shared on WhatsApp, Facebook, iMessage, or Twitter.
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center justify-center bg-white rounded-full p-2 border border-gray-200">
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Explainer Box */}
                  <div className="flex items-start sm:items-center gap-4 mb-2 pb-4 border-b border-gray-100 bg-[#e8f0fe] p-4 rounded-lg">
                    <div className="min-w-[40px] w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a73e8] shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </div>
                    <p className="text-sm text-[#202124] font-medium leading-relaxed">
                      When you send this short link in a chat, the app will pop up a card using the details you provide below.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#202124] mb-2">Headline (Title)</label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="e.g., 🔥 50% OFF Summer Sale!"
                      className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#202124] mb-2">Short Description</label>
                    <textarea
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      placeholder="e.g., Click here to claim your discount before time runs out!"
                      rows={2}
                      className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm shadow-sm resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#202124] mb-2">Preview Image URL</label>
                    <input
                      type="url"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="e.g., https://your-website.com/shoe.png"
                      className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm shadow-sm"
                    />
                    <p className="mt-2 text-xs text-[#5f6368]">Paste a direct link to an image. (Square or landscape works best)</p>
                  </div>
                </div>
              )}
              
              <button type="submit" className="w-full mt-2 py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] focus:outline-none focus:ring-4 focus:ring-[#1a73e8]/20 transition-colors">
                Generate Link
              </button>
            </form>
          </div>
        </div>

        {/* Links Table Section - Right Side */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-3xl border border-[#dadce0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#dadce0]">
                <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Short Link</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Original URL</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#dadce0]">
                  {links.map((link) => {
                    const shortCode = link.custom_alias || link.short_code;
                    const fullShortUrl = `${SHORT_LINK_DOMAIN}${shortCode}`;
                    
                    const isExpired = link.expires_at ? new Date(link.expires_at) < new Date() : false;
                    
                    return (
                      <tr key={link.id} className="hover:bg-[#f8f9fa] transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <a 
                            href={fullShortUrl} 
                            target="_blank" 
                            className="text-[#202124] hover:text-[#1a73e8] font-medium transition-colors"
                          >
                            {shortCode}
                          </a>
                          {link.has_password && <span className="ml-2 text-xs text-[#5f6368]" title="Password Protected">🔒</span>}
                          {link.expires_at && !isExpired && <span className="ml-2 text-xs text-[#f9ab00]" title={`Expires: ${new Date(link.expires_at).toLocaleString()}`}>⏱️</span>}
                        </td>
                        <td className="px-6 py-5 text-sm text-[#5f6368] max-w-[200px] truncate" title={link.original_url}>
                          {link.original_url}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {isExpired ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-[#f8f9fa] text-[#5f6368] border border-[#dadce0]">
                              Expired
                            </span>
                          ) : (
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${link.is_active ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]' : 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]'}`}>
                              {link.is_active ? 'Active' : 'Disabled'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium space-x-4">
                          <button 
                            onClick={() => handleCopy(shortCode, link.id)}
                            className={`${copiedId === link.id ? 'text-[#34a853]' : 'text-[#5f6368] hover:text-[#202124]'} transition-colors inline-block`}
                          >
                            {copiedId === link.id ? 'Copied ✓' : 'Copy'}
                          </button>
                          <button 
                            onClick={() => setQrModalUrl(fullShortUrl)}
                            className="text-[#5f6368] hover:text-[#1a73e8] transition-colors inline-block"
                          >
                            QR
                          </button>
                          <Link 
                            href={`/dashboard/analytics/${link.id}`}
                            className="text-[#5f6368] hover:text-[#1a73e8] transition-colors inline-block"
                          >
                            Analytics
                          </Link>
                          <button 
                            onClick={() => handleEdit(link.id, link.original_url)}
                            className="text-[#5f6368] hover:text-[#1a73e8] transition-colors inline-block"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(link.id)}
                            className="text-[#5f6368] hover:text-[#d93025] transition-colors inline-block"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                {links.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#5f6368] font-medium">
                      You haven&apos;t created any links yet. Build your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#dadce0] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <span className="text-xl font-bold tracking-tight text-[#202124] mb-4 sm:mb-0">
            Snap<span className="text-[#1a73e8]">Link</span>
          </span>
          <p className="text-[#5f6368] text-sm">
            © {new Date().getFullYear()} SnapLink. All rights reserved.
          </p>
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
