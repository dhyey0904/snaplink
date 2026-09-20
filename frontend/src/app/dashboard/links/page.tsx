"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";
import AdOverlay from "@/components/AdOverlay";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const SHORT_LINK_DOMAIN = typeof window !== 'undefined' ? `${window.location.origin}/` : "http://localhost:3000/";

type LinkData = {
  id: number;
  original_url: string;
  short_code: string;
  custom_alias: string | null;
  is_active: boolean;
  has_password: boolean;
  expires_at?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    
  // Drawer state
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  
  // Link creation state
  const [newUrl, setNewUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showProFeatures, setShowProFeatures] = useState(false);
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  
  // Pro features state
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [deviceTargeting, setDeviceTargeting] = useState("all");
  const [abSplit, setAbSplit] = useState("");

  const [copiedId, setCopiedId] = useState<number | null>(null);
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

  

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/bio/upload-image`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error("Failed to upload file");
      const data = await res.json();
      setter(data.url ? `${backendUrl}${data.url}` : "");
    } catch (err: any) {
      alert(err.message);
    }
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
    
    // Construct final URL with UTM if provided
    let finalUrl = newUrl;
    if (utmSource || utmMedium || utmCampaign) {
      try {
        const urlObj = new URL(finalUrl);
        if (utmSource) urlObj.searchParams.set("utm_source", utmSource);
        if (utmMedium) urlObj.searchParams.set("utm_medium", utmMedium);
        if (utmCampaign) urlObj.searchParams.set("utm_campaign", utmCampaign);
        finalUrl = urlObj.toString();
      } catch (e) {
        console.error("Invalid URL for UTM injection");
      }
    }
    
    try {
      const data = await fetchAPI("/links/", {
        method: "POST",
        body: JSON.stringify({ 
          original_url: finalUrl,
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
      setUtmSource("");
      setUtmMedium("");
      setUtmCampaign("");
      setActiveDrawer(null);
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
    
    const newPassword = prompt("Set a new Password for this link?\\n(Leave blank to keep current, or type 'REMOVE' to delete the password)");
    
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

  const handleCopy = (shortCode: string, id: number) => {
    const fullUrl = `${SHORT_LINK_DOMAIN}${shortCode}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(fullUrl);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (error) {
        console.error('Copy failed', error);
      }
      textArea.remove();
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFavicon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch (e) {
      return null;
    }
  };

  // Sparkline Generator
  const generateSparkline = () => {
    const points = Array.from({length: 7}, () => Math.floor(Math.random() * 20) + 5);
    const max = Math.max(...points);
    const svgPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 15} ${30 - (p/max)*25}`).join(' ');
    return (
      <svg className="w-24 h-8 stroke-blue-500 stroke-2 fill-none stroke-linecap-round stroke-linejoin-round" viewBox="-2 -2 100 34">
        <path d={svgPath} />
        <path d={svgPath + ' L 90 30 L 0 30 Z'} className="fill-blue-100 stroke-none opacity-50" />
      </svg>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col font-sans">
      {showAd && <AdOverlay onComplete={() => { setShowAd(false); if(pendingAction) pendingAction(); }} actionText="Generating Link" />}
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col gap-6">
        
        {/* Header & Stats Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Command Center</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your shortened URLs</p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={() => setActiveDrawer('basic')}
              className="w-full sm:w-auto flex-1 sm:flex-none justify-center flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              Basic Link
            </button>
            <button 
              onClick={() => setActiveDrawer('social')}
              className="w-full sm:w-auto flex-1 sm:flex-none justify-center flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-purple-500/20 transition-all active:scale-95 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Social Preview
            </button>
            <button 
              onClick={() => setActiveDrawer('advanced')}
              className="w-full sm:w-auto flex-1 sm:flex-none justify-center flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Advanced Routing
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Links</p>
              <h3 className="text-3xl font-black text-gray-900">{links.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Clicks (Est)</p>
              <h3 className="text-3xl font-black text-gray-900">{links.length * 42}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Campaigns</p>
              <h3 className="text-3xl font-black text-gray-900">{links.filter(l => l.is_active).length}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
          </div>
        </div>

        {/* Links Full Width Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden w-full">
                    {links.length > 0 ? (
            <div className="overflow-x-auto w-full min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8f9fa] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Short Link</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">7D Trend</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {links.map((link) => {
                  const shortCode = link.custom_alias || link.short_code;
                  const fullShortUrl = `${SHORT_LINK_DOMAIN}${shortCode}`;
                  const isExpired = link.expires_at ? new Date(link.expires_at) < new Date() : false;
                  const favicon = getFavicon(link.original_url);
                  
                  return (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden">
                            {favicon ? <img src={favicon} alt="" className="w-4 h-4" /> : <div className="w-4 h-4 bg-gray-300 rounded-full"></div>}
                          </div>
                          <div className="flex flex-col">
                            <a href={fullShortUrl} target="_blank" className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                              {shortCode}
                            </a>
                            <div className="flex gap-1 mt-1">
                              {link.has_password && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">Password</span>}
                              {link.og_title && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-medium">Social</span>}
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">Link</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 max-w-[250px] truncate font-medium" title={link.original_url}>
                          {link.original_url}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {generateSparkline()}
                      </td>
                      <td className="px-6 py-4">
                        {isExpired ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-500">Expired</span>
                        ) : (
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${link.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {link.is_active ? 'Active' : 'Disabled'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleCopy(shortCode, link.id)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
                            {copiedId === link.id ? (
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                            )}
                          </button>
                          <button onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: link.og_title || 'My Link',
                                url: `${SHORT_LINK_DOMAIN}${shortCode}`,
                              }).catch(console.error);
                            } else {
                              alert("Sharing is not supported on this device/browser.");
                            }
                          }} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Share Link">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                          </button>
                          <button onClick={() => setQrModalUrl(fullShortUrl)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="QR Code">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                          </button>
                          <Link href={`/dashboard/analytics/${link.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Analytics">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                          </Link>
                          <button onClick={() => handleEdit(link.id, link.original_url)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button><div className="h-6 w-px bg-gray-200 mx-1"></div>
                          <button onClick={() => handleDelete(link.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[400px] bg-white rounded-3xl w-full">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Links Created Yet</h3>
              <p className="text-gray-500 max-w-sm mb-6">Create your first short link to start tracking clicks, managing destinations, and building your audience.</p>
              <button onClick={() => setActiveDrawer('basic')} className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2.5 rounded-full font-semibold transition-colors">
                Create Your First Link
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

            {/* Slide-out Drawers */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveDrawer(null)} />
          <div className="fixed inset-y-0 right-0 max-w-xl w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10 sticky top-0">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {activeDrawer === 'basic' && "Create Basic Link"}
                    {activeDrawer === 'social' && "Create Social Preview Link"}
                    {activeDrawer === 'advanced' && "Create Advanced Routing Link"}
                  </h2>
                  <p className="text-sm text-gray-500">Shorten, track, and customize</p>
                </div>
                <button onClick={() => setActiveDrawer(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                
                {/* ALWAYS SHOW DESTINATION */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Destination & Routing</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Destination URL <span className="text-red-500">*</span></label>
                    <input type="url" required value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com/long-url..." className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Custom Back-half <span className="text-red-500">*</span></label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                      <span className="inline-flex items-center px-4 bg-gray-100 text-gray-500 text-sm font-medium border-r border-gray-200">snaplinks.in/</span>
                      <input type="text" required value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} placeholder="my-custom-url" className="block w-full px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none text-gray-900 text-sm" />
                    </div>
                  </div>
                </div>

                {/* ADVANCED ROUTING SECTION */}
                {activeDrawer === 'advanced' && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2 border-b border-blue-200/50 pb-2 mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      Advanced Routing (Pro)
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-indigo-800 mb-1">UTM Source</label><input type="text" value={utmSource} onChange={e => setUtmSource(e.target.value)} className="block w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
                        <div><label className="block text-xs font-bold text-indigo-800 mb-1">UTM Medium</label><input type="text" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} className="block w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
                        <div className="col-span-2"><label className="block text-xs font-bold text-indigo-800 mb-1">UTM Campaign</label><input type="text" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} className="block w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
                      </div>
                      <div className="pt-2 border-t border-blue-200/50">
                        <label className="block text-xs font-bold text-indigo-800 mb-1">Device Targeting</label>
                        <select value={deviceTargeting} onChange={e => setDeviceTargeting(e.target.value)} className="block w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-gray-700">
                          <option value="all">All Devices (Default)</option>
                          <option value="ios">iOS Only (Redirect others to fallback)</option>
                          <option value="android">Android Only (Redirect others to fallback)</option>
                        </select>
                      </div>
                      <div className="pt-2 border-t border-blue-200/50">
                        <label className="block text-xs font-bold text-indigo-800 mb-1">A/B Split Test Destination</label>
                        <input type="url" value={abSplit} onChange={e => setAbSplit(e.target.value)} placeholder="https://example.com/variant-b" className="block w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                        <p className="text-[10px] text-indigo-600 mt-1">Send 50% of traffic to this alternate URL.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SOCIAL PREVIEW SECTION */}
                {activeDrawer === 'social' && (
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2 mb-4">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Social Media Preview
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">Headline</label>
                          <input type="text" value={ogTitle} onChange={e => setOgTitle(e.target.value)} placeholder="e.g. My Website" className="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                          <textarea value={ogDescription} onChange={e => setOgDescription(e.target.value)} rows={2} placeholder="Check this out!" className="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">Preview Image</label>
                          <div className="flex gap-3">
                            <input type="url" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://..." className="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" />
                            <label className="flex-shrink-0 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl transition-colors border border-gray-200 flex items-center justify-center text-sm">
                              <span>Upload</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setOgImage)} />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Live WhatsApp Mockup */}
                      <div className="bg-[#e5ddd5] rounded-xl p-4 flex flex-col justify-center border border-gray-300 relative overflow-hidden mt-4">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundSize: 'cover' }}></div>
                        <div className="relative z-10 w-full max-w-[280px] mx-auto">
                          <p className="text-center text-[10px] text-gray-500 bg-[#e1f3fb] rounded-lg px-2 py-1 mx-auto w-max mb-3 shadow-sm">Live WhatsApp Preview</p>
                          <div className="bg-white rounded-lg rounded-tr-none p-1 shadow-md ml-2 mb-2 max-w-full">
                            <div className="bg-[#f0f2f5] rounded border border-[#dae0e5] overflow-hidden cursor-default flex flex-col">
                              <div className="w-full h-[120px] bg-[#d1d7db] flex items-center justify-center overflow-hidden border-b border-[#dae0e5]">
                                {ogImage ? (
                                  <img src={ogImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                ) : (
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                )}
                              </div>
                              <div className="p-2.5">
                                <h3 className="font-semibold text-[#111b21] text-xs truncate leading-tight mb-1">{ogTitle || "My Website"}</h3>
                                <p className="text-[#667781] text-[10px] line-clamp-2 leading-snug">{ogDescription || "Check this out!"}</p>
                                <p className="text-[#667781] text-[9px] mt-1.5 uppercase">snaplinks.in</p>
                              </div>
                            </div>
                            <p className="text-[#027eb5] text-xs p-1.5 break-all hover:underline cursor-pointer">https://snaplinks.in/{customAlias || "alias"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ALWAYS SHOW SECURITY */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Security & Expiration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                      <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank for public" className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Expiration Date</label>
                      <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3 z-10 sticky bottom-0">
                <button type="button" onClick={() => setActiveDrawer(null)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={handleCreateLink} disabled={!newUrl || !customAlias} className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${activeDrawer === 'social' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#1a73e8] hover:bg-[#1557b0]'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  {activeDrawer === 'social' ? 'Generate Social Link' : activeDrawer === 'advanced' ? 'Generate Advanced Link' : 'Generate Link'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

{/* QR Code Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setQrModalUrl(null)}>
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-gray-900 mb-1 text-2xl">QR Code</h3>
            <p className="text-gray-500 text-sm mb-6">Scan to visit instantly</p>
            <div className="bg-white p-4 border border-gray-100 rounded-2xl mb-6 shadow-sm">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrModalUrl)}`} alt="QR Code" width="200" height="200" className="rounded-lg" />
            </div>
            
            <button onClick={() => {
              const link = document.createElement('a');
              link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrModalUrl)}`;
              link.download = `snaplink-qr.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors mb-3">
              Download PNG
            </button>
            <button onClick={() => setQrModalUrl(null)} className="w-full py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {showAdModal && <AdOverlay onComplete={() => executeCreateLink()} actionText="Generating Link" />}
    </div>
  );
}

