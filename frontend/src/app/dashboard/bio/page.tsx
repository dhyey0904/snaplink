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
  const [adEnabled, setAdEnabled] = useState(true);
  
  // New Link form state
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);

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
      setBioPage(data);
      setAlias(data.alias);
      setTitle(data.title);
      setThemeColor(data.theme_color);
      if (data.profile_image_url) setProfileImageUrl(data.profile_image_url);
      if (data.ad_enabled !== undefined) setAdEnabled(data.ad_enabled);
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
          ad_enabled: adEnabled
        })
      });
      setBioPage(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchAPI("/bio/", {
        method: "PUT",
        body: JSON.stringify({ 
          title, 
          theme_color: themeColor,
          profile_image_url: profileImageUrl || null,
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Snap<span className="text-blue-600">Link</span> Dashboard</h1>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Link Shortener
          </Link>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 font-medium">Logout</button>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {!bioPage ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create your Link-in-Bio</h2>
            <p className="text-gray-500 mb-6">One link to share all your content.</p>
            <form onSubmit={handleCreateBio} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Alias</label>
                <div className="flex items-center">
                  <span className="bg-gray-100 border border-gray-300 border-r-0 px-3 py-2 rounded-l-md text-gray-500">snaplinks.in/bio/</span>
                  <input required type="text" value={alias} onChange={e => setAlias(e.target.value)} placeholder="yourname" className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700">Create Bio Page</button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Editor Side */}
            <div className="space-y-6">
              
              {/* Profile Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Profile Settings</h3>
                <form onSubmit={handleUpdateBio} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Page Title</label>
                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Image (Upload from device)</label>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white" 
                    />
                    {profileImageUrl && (
                      <div className="mt-2 text-sm text-green-600 font-medium">Image ready to save!</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Theme Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-12 h-10 p-1 border border-gray-300 rounded cursor-pointer" />
                      <input type="text" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black" />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-bold">Save Profile</button>
                </form>
              </div>

              {/* Add Links */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Add New Link</h3>
                <form onSubmit={handleAddLink} className="space-y-4">
                  <div>
                    <input required type="text" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} placeholder="Title (e.g. My YouTube)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black" />
                  </div>
                  <div>
                    <input required type="url" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="URL (e.g. https://youtube.com/...)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black" />
                  </div>
                  <button type="submit" disabled={isAddingLink} className="w-full py-2 bg-blue-600 text-white rounded-md font-bold disabled:opacity-50">Add Link</button>
                </form>
              </div>
            </div>

            {/* Preview Side */}
            <div className="flex justify-center items-start">
              <div className="w-[320px] min-h-[600px] border-[10px] border-gray-900 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl relative flex flex-col">
                {/* Mobile Header */}
                <div style={{backgroundColor: themeColor}} className="pt-12 pb-6 px-6 text-center text-white">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-3 object-cover shadow-lg border-2 border-white" />
                  ) : (
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl font-bold shadow-lg">
                      {title.charAt(0)}
                    </div>
                  )}
                  <h2 className="font-bold text-lg">{title}</h2>
                  <p className="text-sm opacity-90 mt-1">snaplinks.in/bio/{bioPage.alias}</p>
                </div>
                
                {/* Mobile Links */}
                <div className="flex-1 bg-gray-50 p-4 space-y-3 overflow-y-auto">
                  {bioPage.links && bioPage.links.map((link: any) => (
                    <div key={link.id} className="relative group">
                      <a href={link.url} target="_blank" className="block w-full p-4 bg-white rounded-xl shadow-sm text-center font-semibold text-gray-800 hover:shadow-md transition-all border border-gray-200" style={{borderLeftColor: themeColor, borderLeftWidth: "4px"}}>
                        {link.title}
                      </a>
                      <button onClick={() => handleDeleteLink(link.id)} className="absolute -right-2 -top-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">?</button>
                    </div>
                  ))}
                  {(!bioPage.links || bioPage.links.length === 0) && (
                    <p className="text-center text-gray-400 text-sm mt-8">No links added yet.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
