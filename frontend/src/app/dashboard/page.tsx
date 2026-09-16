"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";

export default function BioDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bioPage, setBioPage] = useState<any>(null);
  
  // Create Bio Page form state
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("My Links");
  const [themeColor, setThemeColor] = useState("#3B82F6");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [adEnabled, setAdEnabled] = useState(true);
  
  // New Link form state
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);

  // QR Modal State
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

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
    loadBioPage();
  }, [router]);

  const loadBioPage = async () => {
    try {
      const data = await fetchAPI("/bio/");
      if (data) {
        setBioPage(data);
        setAlias(data.alias);
        setTitle(data.title);
        setThemeColor(data.theme_color);
        if (data.profile_image_url) setProfileImageUrl(data.profile_image_url);
        if (data.contact_email) setContactEmail(data.contact_email);
        if (data.resume_url) setResumeUrl(data.resume_url);
        if (data.ad_enabled !== undefined) setAdEnabled(data.ad_enabled);
      }
    } catch (err: any) {
      // If 404, user doesn't have a bio page yet. That's fine.
      if (err.message && err.message.includes("not found")) {
        setBioPage(null);
      } else {
        alert(err.message);
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
          theme_color: themeColor,
          profile_image_url: profileImageUrl || null,
          contact_email: contactEmail || null,
          resume_url: resumeUrl || null,
          ad_enabled: adEnabled
        })
      });
      setBioPage(data);
    } catch (err: any) {
      alert(err.message || "Failed to create bio page");
    }
  };

  const handleUpdateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchAPI("/bio/", {
        method: "PUT",
        body: JSON.stringify({ 
          alias, 
          title, 
          theme_color: themeColor,
          profile_image_url: profileImageUrl || null,
          contact_email: contactEmail || null,
          resume_url: resumeUrl || null,
          ad_enabled: adEnabled
        })
      });
      setBioPage(data);
      alert("Profile updated!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingLink(true);
    try {
      const order = bioPage.links ? bioPage.links.length : 0;
      await fetchAPI("/bio/links", {
        method: "POST",
        body: JSON.stringify({ title: newLinkTitle, url: newLinkUrl, order })
      });
      setNewLinkTitle("");
      setNewLinkUrl("");
      await loadBioPage(); // Refresh links
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAddingLink(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm("Delete this link?")) return;
    try {
      await fetchAPI(`/bio/links/${id}`, { method: "DELETE" });
      await loadBioPage(); // Refresh
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
              <Link href="/dashboard" className="text-sm font-medium text-[#1a73e8] border-b-2 border-[#1a73e8] py-5">
                Link-in-Bio
              </Link>
              <Link href="/dashboard/links" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {!bioPage ? (
          <div className="bg-white rounded-3xl border border-[#dadce0] p-10 text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-normal text-[#202124] mb-2">Create your Link-in-Bio</h2>
            <p className="text-[#5f6368] mb-8">One link to share all your content.</p>
            <form onSubmit={handleCreateBio} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-2">Your Alias</label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-[#dadce0] bg-[#f8f9fa] text-[#5f6368] sm:text-sm">
                    snaplinks.in/bio/
                  </span>
                  <input
                    type="text"
                    required
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-md border border-[#dadce0] focus:ring-[#1a73e8] focus:border-[#1a73e8] sm:text-sm text-[#202124]"
                    placeholder="my-name"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] focus:outline-none focus:ring-4 focus:ring-[#1a73e8]/20 transition-colors">
                Create Page
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Settings Side */}
            <div className="space-y-8">
              {/* Profile Settings */}
              <div className="bg-white rounded-3xl border border-[#dadce0] p-8">
                <h3 className="text-xl font-normal text-[#202124] mb-6">Profile Settings</h3>
                <form onSubmit={handleUpdateBio} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#202124] mb-2">Page Title</label>
                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202124] mb-2">Profile Image (Upload from device)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("File is too large (max 2MB)");
                            e.target.value = '';
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => setProfileImageUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="block w-full text-sm text-[#5f6368] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#e8f0fe] file:text-[#1a73e8] hover:file:bg-[#d2e3fc] cursor-pointer"
                    />
                    {profileImageUrl && (
                      <div className="mt-2 text-sm text-[#34a853] font-medium">Image ready to save!</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202124] mb-1.5">Contact Email <span className="text-[#5f6368] font-normal">(Optional)</span></label>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="hello@example.com" className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow placeholder-[#5f6368]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202124] mb-1.5">Resume (Upload PDF) <span className="text-[#5f6368] font-normal">(Optional)</span></label>
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("Resume file is too large (max 2MB)");
                            e.target.value = '';
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => setResumeUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="block w-full text-sm text-[#5f6368] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#e8f0fe] file:text-[#1a73e8] hover:file:bg-[#d2e3fc] cursor-pointer"
                    />
                    {resumeUrl && resumeUrl.startsWith("data:") && (
                      <div className="mt-2 text-sm text-[#34a853] font-medium">Resume ready to save!</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202124] mb-2">Theme Color</label>
                    <div className="flex gap-3">
                      <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-12 h-12 p-1 border border-[#dadce0] rounded-md cursor-pointer bg-white" />
                      <input type="text" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="flex-1 px-4 py-3 border border-[#dadce0] rounded-md text-[#202124] focus:ring-2 focus:ring-[#1a73e8] focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 py-2.5 px-6 rounded-full font-medium text-white bg-[#202124] hover:bg-[#3c4043] focus:outline-none focus:ring-4 focus:ring-gray-200 transition-colors">Save Profile</button>
                    <button type="button" onClick={() => setQrModalUrl(`https://snaplinks.in/bio/${bioPage.alias}`)} className="flex-1 py-2.5 px-6 rounded-full font-medium text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d2e3fc] focus:outline-none focus:ring-4 focus:ring-[#1a73e8]/20 transition-colors">Generate QR</button>
                  </div>
                </form>
              </div>

              {/* Add Links */}
              <div className="bg-white rounded-3xl border border-[#dadce0] p-8">
                <h3 className="text-xl font-normal text-[#202124] mb-6">Add New Link</h3>
                <form onSubmit={handleAddLink} className="space-y-4">
                  <div>
                    <input required type="text" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} placeholder="Title (e.g. My YouTube)" className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow placeholder-[#5f6368]" />
                  </div>
                  <div>
                    <input required type="url" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="URL (e.g. https://youtube.com/...)" className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-[#202124] sm:text-sm transition-shadow placeholder-[#5f6368]" />
                  </div>
                  <button type="submit" disabled={isAddingLink} className="w-full mt-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] focus:outline-none focus:ring-4 focus:ring-[#1a73e8]/20 disabled:opacity-50 transition-colors">Add Link</button>
                </form>
              </div>
            </div>

            {/* Preview Side */}
            <div className="flex justify-center items-start">
              <div className="w-[340px] h-[700px] border-[12px] border-[#202124] rounded-[3rem] overflow-hidden bg-white shadow-2xl relative flex flex-col">
                {/* Mobile Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-[#202124] rounded-b-3xl w-40 mx-auto z-10"></div>
                
                {/* Mobile Header */}
                <div style={{backgroundColor: themeColor}} className="pt-16 pb-8 px-6 text-center text-white relative">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md border-4 border-white/20" />
                  ) : (
                    <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-md border-4 border-white/20">
                      {title.charAt(0)}
                    </div>
                  )}
                  <h2 className="font-bold text-xl tracking-tight">{title}</h2>
                  <p className="text-sm opacity-90 mt-1 font-medium">snaplinks.in/bio/{bioPage.alias}</p>
                </div>
                
                {/* Mobile Links */}
                <div className="flex-1 bg-[#f8f9fa] p-5 space-y-4 overflow-y-auto">
                  {/* Special Buttons */}
                  {bioPage.contact_email && (
                    <a href={`mailto:${bioPage.contact_email}`} className="block w-full p-4 bg-[#202124] text-white rounded-2xl shadow-sm text-center font-medium hover:bg-[#3c4043] transition-all border border-[#202124] flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      Contact Me
                    </a>
                  )}
                  {bioPage.resume_url && (
                    <a href={bioPage.resume_url} download="resume.pdf" className="block w-full p-4 bg-white text-[#202124] rounded-2xl shadow-sm text-center font-medium hover:bg-gray-50 transition-all border-2 border-[#202124] flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      Download Resume
                    </a>
                  )}

                  {bioPage.links && bioPage.links.map((link: any) => (
                    <div key={link.id} className="relative group">
                      <a href={link.url} target="_blank" className="block w-full p-4 bg-white rounded-2xl shadow-sm text-center font-medium text-[#202124] hover:shadow-md transition-all border border-[#dadce0]" style={{borderLeftColor: themeColor, borderLeftWidth: "6px"}}>
                        {link.title}
                      </a>
                      <button onClick={() => handleDeleteLink(link.id)} className="absolute -right-2 -top-2 bg-[#d93025] text-white w-7 h-7 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm flex items-center justify-center">✕</button>
                    </div>
                  ))}
                  {(!bioPage.links || bioPage.links.length === 0) && (
                    <p className="text-center text-[#5f6368] text-sm mt-10">No links added yet.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
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
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Bio QR Code</h3>
            <p className="text-sm text-gray-500 mb-6">Scan to view your Link-in-Bio</p>
            <div className="flex justify-center mb-6">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalUrl)}`} alt="QR Code" width="200" height="200" />
            </div>
            <div className="space-y-3">
              <button onClick={handleDownloadQR} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors w-full shadow-sm">
                Download Image
              </button>
              <button onClick={() => setQrModalUrl(null)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors w-full">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
