'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function BioDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bioPage, setBioPage] = useState<any>(null);
  
  // Tabs
  const [activeTab, setActiveTab] = useState('links'); // 'links', 'profile', 'design', 'preview'

  // Create Bio Page form state
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("My Links");
  const [bioText, setBioText] = useState("");
  const [themeColor, setThemeColor] = useState("#3B82F6");
  const [themeType, setThemeType] = useState("dark-glass");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [adEnabled, setAdEnabled] = useState(true);

  const themes: Record<string, any> = {
    'dark-glass': {
      bg: 'bg-[#0a0a0f]',
      text: 'text-white',
      textSec: 'text-[#b0a8c2]',
      textMuted: 'text-white/40',
      linkBg: 'bg-white/[0.03] border border-white/[0.05] shadow-lg',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/40 font-medium',
      iconBg: 'bg-white/5 border border-white/10 text-white',
      featuredClass: 'bg-gradient-to-r from-[#ff4b72] to-[#8b2cff] shadow-lg text-white',
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#0a0a0f]',
      showMesh: true,
      socialBg: 'bg-white/[0.04] border-white/[0.08] text-white',
    },
    'light-glass': {
      bg: 'bg-[#f8f9fa]',
      text: 'text-gray-900',
      textSec: 'text-gray-600',
      textMuted: 'text-gray-400',
      linkBg: 'bg-white/60 border border-white shadow-md',
      linkText: 'text-gray-900 font-bold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-white border border-gray-100 text-gray-900 shadow-sm',
      featuredClass: `bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg text-white`,
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#f8f9fa]',
      showMesh: true,
      socialBg: 'bg-white border-gray-200 text-gray-700 shadow-sm',
    },
    'solid': {
      bg: '', 
      text: 'text-white',
      textSec: 'text-white/90',
      textMuted: 'text-white/60',
      linkBg: 'bg-black/10 border border-transparent shadow-sm',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/70 font-medium',
      iconBg: 'bg-black/20 text-white',
      featuredClass: 'bg-white text-black shadow-lg',
      featuredIconBg: 'bg-black/10 text-black',
      profileBg: 'transparent',
      showMesh: false,
      socialBg: 'bg-black/10 text-white border-transparent',
    },
    'neo-brutalism': {
      bg: 'bg-[#FDF9F1]',
      text: 'text-black',
      textSec: 'text-black',
      textMuted: 'text-gray-700',
      linkBg: 'bg-white border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none',
      linkText: 'text-black font-black uppercase tracking-tight',
      linkSub: 'text-gray-800 font-bold',
      iconBg: 'bg-[#FFEB3B] border-2 border-black text-black rounded-none',
      featuredClass: 'bg-[#FF90E8] border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none text-black',
      featuredIconBg: 'bg-white border-2 border-black text-black rounded-none',
      profileBg: 'bg-[#FDF9F1]',
      showMesh: false,
      socialBg: 'bg-white border-2 border-black text-black',
    },
    'minimal': {
      bg: 'bg-white',
      text: 'text-gray-900',
      textSec: 'text-gray-500',
      textMuted: 'text-gray-400',
      linkBg: 'bg-transparent border border-gray-200 rounded-lg',
      linkText: 'text-gray-900 font-semibold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-gray-50 text-gray-700 border-none rounded-lg',
      featuredClass: 'bg-gray-900 text-white rounded-lg',
      featuredIconBg: 'bg-white/20 text-white rounded-lg',
      profileBg: 'bg-white',
      showMesh: false,
      socialBg: 'bg-transparent border border-gray-200 text-gray-700 rounded-full',
    }
  };

  const t = themes[themeType] || themes['dark-glass'];

  
  // New Link form state
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState("link");
  const [newLinkPrice, setNewLinkPrice] = useState("");
  const [newLinkImageUrl, setNewLinkImageUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);

  // QR Modal State
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    return null;
  };

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
      setter(`${backendUrl}${data.url}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  
    const handleShareLink = async () => {
    if (!bioPage) return;
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/bio/${bioPage.alias}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'My Bio Page',
          text: bioText || 'Check out my links!',
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      setShareUrl(url);
      setShowShareModal(true);
    }
  };

    const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3) hexcolor = hexcolor.split('').map(c => c + c).join('');
    var r = parseInt(hexcolor.substr(0,2),16) || 0;
    var g = parseInt(hexcolor.substr(2,2),16) || 0;
    var b = parseInt(hexcolor.substr(4,2),16) || 0;
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  const handleDownloadQR = async () => {
    if (!qrModalUrl) return;
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrModalUrl)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const aliasPart = qrModalUrl.split('/').pop() || 'bio';
      link.download = `snaplink-qr-${aliasPart}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download QR code", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    loadBioPage();
  }, []);

  const loadBioPage = async () => {
    try {
      const data = await fetchAPI("/bio/");
      if (data) {
        setBioPage(data);
        setAlias(data.alias);
        setTitle(data.title);
        if (data.bio_text) setBioText(data.bio_text);
        setThemeColor(data.theme_color);
        if (data.theme_type) setThemeType(data.theme_type);
        if (data.profile_image_url) setProfileImageUrl(data.profile_image_url);
        if (data.contact_email) setContactEmail(data.contact_email);
        if (data.resume_url) setResumeUrl(data.resume_url);
        if (data.github_url) setGithubUrl(data.github_url);
        if (data.twitter_url) setTwitterUrl(data.twitter_url);
        if (data.instagram_url) setInstagramUrl(data.instagram_url);
        if (data.linkedin_url) setLinkedinUrl(data.linkedin_url);
        if (data.ad_enabled !== undefined) setAdEnabled(data.ad_enabled);
      }
    } catch (err: any) {
      if (err.message && err.message.includes("not found")) {
        setBioPage(null);
      } else {
        alert("Failed to load bio page: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchAPI("/bio/", {
        method: "POST",
        body: JSON.stringify({ 
          alias, 
          title, 
          bio_text: bioText || null,
          theme_color: themeColor,
          profile_image_url: profileImageUrl || null,
          contact_email: contactEmail || null,
          resume_url: resumeUrl || null,
          github_url: githubUrl || null,
          twitter_url: twitterUrl || null,
          instagram_url: instagramUrl || null,
          linkedin_url: linkedinUrl || null,
          ad_enabled: adEnabled
        })
      });
      setBioPage(data);
    } catch (err: any) {
      alert(err.message || "Failed to create bio page");
    }
  };

  const autoSave = async () => {
    if (!bioPage) return;
    try {
      const data = await fetchAPI("/bio/", {
        method: "PUT",
        body: JSON.stringify({ 
          alias, 
          title, 
          bio_text: bioText || null,
          theme_color: themeColor,
          profile_image_url: profileImageUrl || null,
          contact_email: contactEmail || null,
          resume_url: resumeUrl || null,
          github_url: githubUrl || null,
          twitter_url: twitterUrl || null,
          instagram_url: instagramUrl || null,
          linkedin_url: linkedinUrl || null,
          ad_enabled: adEnabled
        })
      });
      setBioPage(data);
    } catch (err: any) {
      console.error("Auto-save failed:", err.message);
    }
  };

  const handleUpdateBio = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await autoSave();
    alert("Profile saved successfully!");
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;
    setIsAddingLink(true);

    let metadata_json = null;
    if (newLinkType === 'product') {
      metadata_json = JSON.stringify({ price: newLinkPrice, image_url: newLinkImageUrl });
    }

    try {
      const order = bioPage?.links ? bioPage.links.length : 0;
      const newLink = await fetchAPI("/bio/links", {
        method: "POST",
        body: JSON.stringify({
          title: newLinkTitle,
          url: newLinkUrl,
          link_type: newLinkType,
          metadata_json: metadata_json,
          order
        })
      });
      setNewLinkTitle("");
      setNewLinkUrl("");
      setNewLinkType("link");
      setNewLinkPrice("");
      setNewLinkImageUrl("");
      
      setBioPage((prev: any) => {
        if (!prev) return prev;
        return { ...prev, links: [...(prev.links || []), newLink] };
      });
    } catch (err: any) {
      alert(err.message || err);
    } finally {
      setIsAddingLink(false);
    }
  };

    const handleToggleLink = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:8000/api/bio/links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) loadBioPage();
    } catch (err) {
      console.error('Failed to toggle link');
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm("Delete this link?")) return;
    try {
      await fetchAPI(`/bio/links/${id}`, { method: "DELETE" });
      setBioPage((prev: any) => {
        if (!prev) return prev;
        return { ...prev, links: prev.links.filter((l: any) => l.id !== id) };
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans bg-[#f9fafb]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a73e8]"></div></div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-12">
        {!bioPage ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-xl mx-auto mt-10 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Claim your URL</h2>
            <p className="text-gray-500 mb-8">One link to share all your content across platforms.</p>
            <form onSubmit={handleCreateBio} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Alias</label>
                <div className="flex rounded-xl shadow-sm overflow-hidden border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 sm:text-sm border-r border-gray-200 font-medium">
                    snaplinks.in/bio/
                  </span>
                  <input
                    type="text"
                    required
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-4 py-3 border-none focus:ring-0 sm:text-sm text-gray-900 font-medium"
                    placeholder="my-name"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5">
                Create Page
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Header */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                  <p className="text-gray-500 text-sm mt-1">Manage your Link-in-Bio page</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <a href={`/bio/${bioPage.alias}`} target="_blank" className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm border border-gray-200 transition-colors flex-1 sm:flex-none min-w-0">
                    <span className="truncate">snaplinks.in/bio/{bioPage.alias}</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                  <button onClick={() => setQrModalUrl(`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/bio/${bioPage.alias}`)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm border border-blue-100 transition-colors flex-shrink-0" title="Share QR">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    <span className="hidden sm:inline">Share QR</span>
                  </button>
                  <button onClick={handleShareLink} className="bg-gray-900 text-white hover:bg-gray-800 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm shadow-sm transition-colors flex-shrink-0" title="Share">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              
              {/* Left Column (Editor) */}
              <div className={`lg:col-span-7 xl:col-span-8 flex-col flex`}>
                
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 self-start w-full sm:w-auto">
                    <button onClick={() => setActiveTab('links')} className={`px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center ${activeTab === 'links' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Links</button>
                    <button onClick={() => setActiveTab('profile')} className={`px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center ${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Profile</button>
                    <button onClick={() => setActiveTab('design')} className={`px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center ${activeTab === 'design' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Appearance</button>
                    <button onClick={() => setActiveTab('preview')} className={`lg:hidden px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center w-full mt-1 sm:mt-0 ${activeTab === 'preview' ? 'bg-[#1a73e8] text-white shadow-md' : 'text-blue-600 hover:bg-blue-50 bg-blue-50/50'}`}>Live Preview</button>
                  </div>

                {/* Tab Content */}
                <div className="flex-1">
                  
                  {activeTab === 'links' && (
                    <div className="space-y-6">
                      
                      {/* Add Link Card */}
                      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                          </div>
                          Add New Link
                        </h3>
                        <form onSubmit={handleAddLink} className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Block Type</label>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-2">
                              {['link', 'video', 'product', 'donation'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setNewLinkType(type)}
                                  className={`px-3 py-2.5 text-sm font-bold rounded-xl border transition-all ${
                                    newLinkType === type
                                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                {newLinkType === 'video' ? 'Video Title' : newLinkType === 'product' ? 'Product Name' : newLinkType === 'donation' ? 'Support Title' : 'Link Title'}
                              </label>
                              <input 
                                type="text" 
                                value={newLinkTitle} 
                                onChange={(e) => setNewLinkTitle(e.target.value)} 
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white" 
                                placeholder={newLinkType === 'video' ? "My Latest Vlog" : newLinkType === 'donation' ? "Buy me a coffee" : "Title"} 
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                {newLinkType === 'video' ? 'Upload Video (or enter URL)' : newLinkType === 'product' ? 'Checkout URL' : newLinkType === 'donation' ? 'Stripe / PayPal URL' : 'URL'}
                              </label>
                              {newLinkType === 'video' ? (
                                <div className="flex flex-col gap-2">
                                  <input 
                                    type="file" 
                                    accept="video/*"
                                    onChange={(e) => handleImageUpload(e, setNewLinkUrl)} 
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl" 
                                  />
                                  
                                </div>
                              ) : (
                                <input 
                                  type="url" 
                                  value={newLinkUrl} 
                                  onChange={(e) => setNewLinkUrl(e.target.value)} 
                                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white" 
                                  placeholder="https://..." 
                                  required
                                />
                              )}
                            </div>
                          </div>
                          
                          {newLinkType === 'product' && (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 p-5 bg-gray-50 rounded-xl border border-gray-100">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (e.g. $19.99)</label>
                                <input 
                                  type="text" 
                                  value={newLinkPrice} 
                                  onChange={(e) => setNewLinkPrice(e.target.value)} 
                                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" 
                                  placeholder="$19.99" 
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Image</label>
                                <div className="flex gap-2 items-center">
                                  {newLinkImageUrl && <img src={newLinkImageUrl} className="w-10 h-10 rounded-lg object-cover" />}
                                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setNewLinkImageUrl)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-700 cursor-pointer border border-gray-200 rounded-xl" />
                                </div>
                              </div>
                            </div>
                          )}

                          <button type="submit" disabled={isAddingLink} className="w-full sm:w-auto px-8 py-3.5 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 transition-all">
                            {isAddingLink ? 'Adding...' : 'Add Block'}
                          </button>
                        </form>
                      </div>
                      
                      {/* Link List */}
                      <div className="space-y-4">
                        {(!bioPage.links || bioPage.links.length === 0) && (
                          <div className="bg-white rounded-[2rem] border border-dashed border-gray-300 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            </div>
                            <p className="text-gray-900 font-bold mb-1">No blocks added yet</p>
                            <p className="text-gray-500 text-sm">Add your first link using the form above.</p>
                          </div>
                        )}
                        {bioPage.links?.map((link: any) => (
                          <div key={link.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow group relative">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                              {link.link_type === 'video' ? <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg> :
                               link.link_type === 'product' ? <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> :
                               link.link_type === 'donation' ? <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> :
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-900 font-bold truncate">{link.title}</h4>
                              <p className="text-gray-500 text-sm truncate">{link.url}</p>
                            </div>
                            <button onClick={() => handleDeleteLink(link.id)} className="w-10 h-10 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 flex items-center justify-center transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 p-6 sm:p-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Settings</h3>
                      <form onSubmit={handleUpdateBio} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Page Title</label>
                            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Profile Image</label>
                            <div className="flex gap-3 items-center">
                              {profileImageUrl && <img src={profileImageUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0" />}
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setProfileImageUrl)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio Text</label>
                          <textarea value={bioText} onChange={e => setBioText(e.target.value)} placeholder="A short description about yourself" rows={3} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 resize-none" />
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                          <h4 className="text-sm font-bold text-gray-900 mb-4">Contact & Resume</h4>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Email</label>
                              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900" placeholder="hello@example.com" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resume Upload</label>
                                <input 
                                  type="file" 
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => handleImageUpload(e, setResumeUrl)} 
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-all" 
                                />
                                {resumeUrl && <p className="text-xs text-green-600 mt-2 font-medium break-all max-w-[200px] truncate">Uploaded: {resumeUrl}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                          <h4 className="text-sm font-bold text-gray-900 mb-4">Social Links</h4>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Twitter / X</label>
                              <input type="url" value={twitterUrl} onChange={e => setTwitterUrl(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900" placeholder="https://twitter.com/..." />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instagram</label>
                              <input type="url" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900" placeholder="https://instagram.com/..." />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">LinkedIn</label>
                              <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">GitHub</label>
                              <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900" placeholder="https://github.com/..." />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button type="submit" className="px-8 py-3.5 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-colors shadow-md">Save Profile Changes</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'design' && (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 p-6 sm:p-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Appearance</h3>
                      <form onSubmit={handleUpdateBio} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Theme Style</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {[
                                { id: 'dark-glass', name: 'Dark Glass', bg: 'bg-[#0a0a0f] border-gray-700' },
                                { id: 'light-glass', name: 'Light Glass', bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' },
                                { id: 'solid', name: 'Solid Color', bg: 'bg-blue-500 border-transparent' },
                                { id: 'neo-brutalism', name: 'Neo Brutalism', bg: 'bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none' },
                                { id: 'minimal', name: 'Minimalist', bg: 'bg-white border-gray-200' }
                              ].map(theme => (
                                <div 
                                  key={theme.id}
                                  onClick={() => setThemeType(theme.id)}
                                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${themeType === theme.id ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                  <div className={`w-full h-12 rounded-lg mb-3 border ${theme.bg}`}></div>
                                  <p className="text-center font-bold text-sm text-gray-900">{theme.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Brand Color</label>
                          <div className="flex items-center gap-4">
                            <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-16 h-16 rounded-2xl cursor-pointer border-0 shadow-sm" style={{ backgroundColor: themeColor }} />
                            <input type="text" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="flex-1 max-w-[200px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono uppercase text-gray-900" />
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button type="submit" className="px-8 py-3.5 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-colors shadow-md">Save Appearance</button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column (Live Preview) */}
              <div className={`lg:col-span-5 xl:col-span-4 relative ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
                <div className="sticky top-8 flex justify-center pb-8">
                  {/* Realistic iPhone Frame */}
                  <div className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-black p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10 flex-shrink-0 mx-auto">
                    
                    {/* Hardware Buttons */}
                    <div className="absolute top-[120px] -left-[2px] w-[3px] h-[30px] bg-gray-800 rounded-l-md"></div>
                    <div className="absolute top-[170px] -left-[2px] w-[3px] h-[60px] bg-gray-800 rounded-l-md"></div>
                    <div className="absolute top-[240px] -left-[2px] w-[3px] h-[60px] bg-gray-800 rounded-l-md"></div>
                    <div className="absolute top-[190px] -right-[2px] w-[3px] h-[90px] bg-gray-800 rounded-r-md"></div>

                    {/* Screen */}
                    <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col">
                      
                      {/* Dynamic Island & Status Bar */}
                      <div className="absolute top-0 inset-x-0 h-14 z-30 pointer-events-none flex justify-between items-start px-6 pt-3 text-[13px] font-semibold text-white">
                        <span className="mt-1 ml-1 drop-shadow-md">9:41</span>
                        
                        {/* Dynamic Island */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[120px] h-[32px] bg-black rounded-full flex items-center justify-end px-3 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                          <div className="w-3 h-3 rounded-full bg-[#111] shadow-inner mr-1.5 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]"></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 mr-1 drop-shadow-md">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21L23.6 7.4C22.6 6.6 18.2 3 12 3 5.8 3 1.4 6.6 0.4 7.4L12 21Z"/></svg>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z"/></svg>
                          <div className="w-6 h-3 rounded-[4px] border border-white flex items-center p-[1px]"><div className="bg-white h-full w-[80%] rounded-[2px]"></div></div>
                        </div>
                      </div>

                      {/* Bottom Home Indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-black/30 backdrop-blur-md rounded-full z-30 pointer-events-none"></div>

                      {/* Scrollable Content inside Screen */}
                      <div className={`flex-1 overflow-y-auto hide-scrollbar flex flex-col pt-12 relative z-10 ${t.bg}`} style={themeType === 'solid' ? { backgroundColor: themeColor } : {}}>
                        
                        {/* Mesh background */}
                        {t.showMesh && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            {themeType === 'dark-glass' ? (
                              <>
                                <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[50%] rounded-full blur-[60px] opacity-40 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                                <div className="absolute top-[20%] right-[-20%] w-[150%] h-[50%] rounded-full blur-[80px] opacity-30 mix-blend-screen" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
                              </>
                            ) : (
                              <>
                                <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[50%] rounded-full blur-[60px] opacity-[0.15] mix-blend-multiply" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                                <div className="absolute top-[20%] right-[-20%] w-[150%] h-[50%] rounded-full blur-[80px] opacity-[0.15] mix-blend-multiply" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
                              </>
                            )}
                          </div>
                        )}

                        <div className="w-full z-10 flex flex-col items-center px-4 pb-8">
                          
                          <div className="relative mb-3 mt-2">
                            {themeType === 'dark-glass' && (
                              <div className="absolute -inset-[2px] rounded-full bg-gradient-to-tr from-[#ff6b6b] via-[#c0392b] to-[#8e44ad] p-[2px] shadow-sm">
                                <div className="w-full h-full bg-[#0a0a0f] rounded-full"></div>
                              </div>
                            )}
                            <div className="relative">
                              {profileImageUrl ? (
                                <img src={profileImageUrl} alt="Profile" className={`w-[80px] h-[80px] rounded-full object-cover border ${themeType === 'neo-brutalism' ? 'border-2 border-black rounded-none shadow-[2px_2px_0_0_#000]' : 'border-transparent'}`} style={themeType !== 'neo-brutalism' ? { borderColor: t.profileBg } : {}} />
                              ) : (
                                <div className={`w-[80px] h-[80px] flex items-center justify-center text-3xl font-black ${themeType === 'neo-brutalism' ? 'border-2 border-black bg-[#FF90E8] text-black shadow-[2px_2px_0_0_#000]' : 'rounded-full bg-gray-200 text-gray-500'}`} style={themeType !== 'neo-brutalism' && !t.bg.includes('white') ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } : {}}>
                                  {title.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>

                          <h2 className={`font-bold text-lg tracking-tight mb-0.5 ${t.text}`}>{title}</h2>
                          <p className={`text-xs font-medium mb-3 ${t.textSec}`}>snaplinks.in/bio/{alias}</p>
                          
                          {bioText && (
                            <p className={`text-center text-[13px] leading-[1.5] mb-5 ${t.textMuted}`}>
                              {bioText}
                            </p>
                          )}

                          <div className="w-full flex flex-col gap-3">
                            {(!bioPage?.links || bioPage.links.length === 0) ? (
                              <div className={`p-4 text-center rounded-[16px] border text-xs ${t.linkBg} ${t.textMuted}`}>
                                No links added yet.
                              </div>
                            ) : (
                              bioPage.links.map((link: any, index: number) => {
                                const isFeatured = index === 0;
                                const borderRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-md' : 'rounded-[16px]';
                                const cardClass = isFeatured ? `${borderRad} p-3 w-full flex items-center justify-between ${t.featuredClass}` : `${borderRad} p-3 w-full flex items-center justify-between ${t.linkBg}`;
                                const iconRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-md' : 'rounded-[10px]';
                                const iconContainerClass = isFeatured ? `w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 ${iconRad} ${t.featuredIconBg}` : `w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 ${iconRad} ${themeType === 'dark-glass' ? '' : t.iconBg}`;
                                const titleClass = `text-[13px] mb-0.5 ${isFeatured ? (themeType === 'solid' ? 'text-black' : 'text-white') : t.linkText} ${themeType === 'neo-brutalism' ? 'font-black uppercase' : 'font-bold'}`;
                                
                                return (
                                  <div key={link.id} className={cardClass}>
                                    <div className="flex items-center">
                                      <div className={iconContainerClass} style={!isFeatured && themeType === 'dark-glass' ? { background: themeColor, color: 'white' } : {}}>
                                        <div className="w-4 h-4 rounded-full bg-current opacity-50"></div>
                                      </div>
                                      <div className="flex flex-col text-left justify-center">
                                        <span className={titleClass}>{link.title}</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            )}
                          </div>
                          
                          {/* Social Icons inside preview */}
                          {(twitterUrl || instagramUrl || githubUrl || linkedinUrl) && (
                            <div className="flex justify-center gap-4 pt-6 pb-4">
                              {twitterUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></div>}
                              {instagramUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>}
                              {githubUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></div>}
                              {linkedinUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></div>}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* QR Code Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setQrModalUrl(null)}>
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Bio QR Code</h3>
            <p className="text-sm text-gray-500 mb-6">Scan to view your Link-in-Bio</p>
            <div className="flex justify-center mb-8 p-4 bg-gray-50 rounded-2xl">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalUrl)}`} alt="QR Code" width="200" height="200" className="rounded-xl" />
            </div>
            <div className="space-y-3">
              <button onClick={handleDownloadQR} className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors w-full shadow-lg shadow-blue-500/30">
                Download Image
              </button>
              <button onClick={() => setQrModalUrl(null)} className="px-6 py-3.5 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-colors w-full">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-gray-900 mb-1 text-2xl">Share Link</h3>
            <p className="text-gray-500 text-sm mb-6">Share your bio page directly</p>
            
            <div className="flex gap-4 mb-6">
              <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out my bio page!")}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <button onClick={() => {
                if (navigator.clipboard && window.isSecureContext) {
                  navigator.clipboard.writeText(shareUrl);
                } else {
                  const textArea = document.createElement("textarea");
                  textArea.value = shareUrl;
                  textArea.style.position = "fixed";
                  textArea.style.left = "-999999px";
                  textArea.style.top = "-999999px";
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  try { document.execCommand('copy'); } catch(e) {}
                  textArea.remove();
                }
                alert("Copied to clipboard!");
              }} className="w-12 h-12 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors" title="Copy Link">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              </button>
            </div>
            
            <button onClick={() => setShowShareModal(false)} className="w-full py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

