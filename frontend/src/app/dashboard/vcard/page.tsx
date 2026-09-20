'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import QRCode from 'react-qr-code';
import Footer from '@/components/Footer';

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
  
  const res = await fetch(`${backendUrl}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }
  
  return res.json();
};

const Accordion = ({ title, isOpen, onToggle, children }: any) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-sm">
    <button type="button" onClick={onToggle} className="w-full px-5 py-4 bg-gray-50 flex justify-between items-center font-bold text-gray-900 hover:bg-gray-100 transition-colors">
      {title}
      <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    </button>
    {isOpen && <div className="p-5 bg-white space-y-4">{children}</div>}
  </div>
);

export default function VCardDashboard() {
  const [alias, setAlias] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [theme, setTheme] = useState('dark');
  const [backDetails, setBackDetails] = useState('');
  const [bgMusic, setBgMusic] = useState('none');
  
  const [headshotUrl, setHeadshotUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [statusBadge, setStatusBadge] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [customLinks, setCustomLinks] = useState<{title: string, url: string}[]>([]);
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleFlip = () => setIsFlipped(!isFlipped);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [isSpinPaused, setIsSpinPaused] = useState(false);
  
  const [openAccordion, setOpenAccordion] = useState<string>('basic');
  
  const router = useRouter();
  const SHORT_LINK_DOMAIN = process.env.NEXT_PUBLIC_SHORT_LINK_DOMAIN || (typeof window !== 'undefined' ? `${window.location.origin}/v/` : 'http://localhost:3000/v/');
  const fullUrl = `${SHORT_LINK_DOMAIN}${alias}`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchCard = async () => {
      try {
        const data = await fetchAPI('/vcard/me');
        if (data && !data.detail) {
          setAlias(data.custom_alias || '');
          setName(data.name || '');
          setCompany(data.company || '');
          setJobTitle(data.job_title || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setWhatsapp(data.whatsapp || '');
          setTheme(data.theme_color || 'dark');
          setBackDetails(data.back_details || '');
          setBgMusic(data.bg_music || 'none');
          
          setHeadshotUrl(data.headshot_url || '');
          setLogoUrl(data.logo_url || '');
          setStatusBadge(data.status_badge || '');
          setResumeUrl(data.resume_url || '');
          if (data.custom_links) {
            try { setCustomLinks(JSON.parse(data.custom_links)); } catch(e) {}
          }
        }
      } catch (err: any) {
        if (err.message === 'Could not validate credentials') {
           localStorage.removeItem('token');
           router.push('/login');
        } else if (err.message !== 'No business card found') {
           console.log(err.message); // Use log to prevent Next.js from throwing an error overlay
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, [router]);

  const togglePreviewMusic = () => {
    if (audioRef.current) {
      if (isPreviewPlaying) {
        audioRef.current.pause();
        setIsPreviewPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPreviewPlaying(true))
          .catch(err => console.error("Could not play audio", err));
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
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

  const addCustomLink = () => setCustomLinks([...customLinks, { title: '', url: '' }]);
  const updateCustomLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...customLinks];
    newLinks[index][field] = value;
    setCustomLinks(newLinks);
  };
  const removeCustomLink = (index: number) => setCustomLinks(customLinks.filter((_, i) => i !== index));

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!alias) {
      setError('Please provide an alias');
      return;
    }
    setError('');
    
    try {
      await fetchAPI('/vcard/', {
        method: 'POST',
        body: JSON.stringify({
          custom_alias: alias,
          name,
          company,
          job_title: jobTitle,
          phone,
          email,
          whatsapp,
          theme_color: theme,
          back_details: backDetails,
          bg_music: bgMusic,
          headshot_url: headshotUrl,
          logo_url: logoUrl,
          status_badge: statusBadge,
          resume_url: resumeUrl,
          custom_links: JSON.stringify(customLinks)
        })
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving card');
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
  }

  // Generate Theme Background for Phone Mockup
  const phoneBg = (() => {
    switch (theme) {
      case 'gold': return 'linear-gradient(135deg, #111111, #2c220f)';
      case 'glass': return 'linear-gradient(135deg, #f5f7fa, #c3cfe2)';
      case 'cyberpunk': return 'linear-gradient(135deg, #09090b, #1a0b2e)';
      case 'holographic': return 'linear-gradient(135deg, #2a0845, #6441A5)';
      case 'sapphire': return 'linear-gradient(135deg, #010a15, #002244)';
      case 'light': return 'linear-gradient(135deg, #e0eafc, #cfdef3)';
      default: return 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)';
    }
  })();

  // Card Material Styles
  const cardMaterialBg = (() => {
    switch (theme) {
      case 'gold': return 'linear-gradient(135deg, #d4af37, #f3e5ab, #aa771c)';
      case 'glass': return 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))';
      case 'cyberpunk': return 'linear-gradient(135deg, rgba(255,0,204,0.9), rgba(51,51,153,0.95))';
      case 'holographic': return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)';
      case 'sapphire': return 'linear-gradient(135deg, rgba(0,78,146,0.95), rgba(0,4,40,0.9))';
      case 'light': return 'linear-gradient(135deg, rgba(255,255,255,1), rgba(245,245,245,0.95))';
      default: return 'linear-gradient(135deg, rgba(20,20,20,0.95), rgba(10,10,10,0.98))';
    }
  })();
  
  const glowShadow = (() => {
    switch (theme) {
      case 'gold': return '0 0 20px rgba(212, 175, 55, 0.4)';
      case 'cyberpunk': return '0 0 20px rgba(255, 0, 204, 0.5)';
      case 'holographic': return '0 0 20px rgba(255, 154, 158, 0.5)';
      case 'sapphire': return '0 0 20px rgba(0, 78, 146, 0.5)';
      case 'glass': return '0 0 20px rgba(255, 255, 255, 0.3)';
      case 'light': return '0 0 20px rgba(255, 255, 255, 0.5)';
      default: return '0 0 20px rgba(255, 255, 255, 0.1)';
    }
  })();
  
  const isDarkText = ['gold', 'glass', 'light', 'holographic'].includes(theme);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-20 mb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: EDITOR FORM */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-10 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Card Editor</h2>
                  <p className="text-sm text-gray-500 mt-1">Design your 3D digital business card</p>
                </div>
                <button onClick={handleSave} className="hidden sm:inline-flex px-6 py-3 bg-[#1a73e8] text-white text-sm font-bold rounded-xl hover:bg-[#1557b0] transition-colors shadow-md shadow-blue-500/30 whitespace-nowrap">
                  {isSaved ? '✅ Saved!' : 'Save Changes'}
                </button>
              </div>
              
              {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 mb-6 font-medium">{error}</div>}
              
              <form id="vcard-form" onSubmit={handleSave} className="space-y-4">
                
                <Accordion title="1. Basic Info" isOpen={openAccordion === 'basic'} onToggle={() => toggleAccordion('basic')}>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Custom Alias</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-200">
                      <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 sm:text-sm border-r border-gray-200 font-medium">
                        snaplinks.in/v/
                      </span>
                      <input type="text" required value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="your-name" className="flex-1 block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                      <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="CEO & Founder" className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+12345678900" className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label>
                      <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+12345678900" className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="2. Rich Media & Branding" isOpen={openAccordion === 'media'} onToggle={() => toggleAccordion('media')}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Status Badge</label>
                      <select value={statusBadge} onChange={e => setStatusBadge(e.target.value)} className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                        <option value="">None</option>
                        <option value="Open to Work">Open to Work</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Available for Hire">Available for Hire</option>
                        <option value="Founder">Founder</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Headshot Image</label>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                          <span className="text-xs font-semibold text-gray-500">{headshotUrl ? 'Change Headshot' : 'Upload Headshot'}</span>
                          <input type="file" className="hidden text-gray-900 placeholder-gray-400" accept="image/*" onChange={(e) => handleImageUpload(e, setHeadshotUrl)} />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Company Logo</label>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                          <span className="text-xs font-semibold text-gray-500">{logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                          <input type="file" className="hidden text-gray-900 placeholder-gray-400" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoUrl)} />
                        </label>
                      </div>
                    </div>
                  </div>
                </Accordion>

                <Accordion title="3. Career & Links" isOpen={openAccordion === 'links'} onToggle={() => toggleAccordion('links')}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Resume (PDF URL or File)</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input type="url" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} placeholder="https://..." className="flex-1 px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-lg transition-colors border border-gray-200 flex items-center justify-center text-sm whitespace-nowrap">
                          Upload PDF
                          <input type="file" accept="application/pdf" className="hidden text-gray-900 placeholder-gray-400" onChange={(e) => handleImageUpload(e, setResumeUrl)} />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Custom Links</label>
                      <div className="space-y-3">
                        {customLinks.map((link, idx) => (
                          <div key={idx} className="relative flex flex-col sm:flex-row gap-2 sm:items-center bg-gray-50 p-3 pr-10 rounded-lg border border-gray-200">
                            <input type="text" placeholder="Title (e.g. GitHub)" value={link.title} onChange={e => updateCustomLink(idx, 'title', e.target.value)} className="w-full sm:w-1/3 px-3 py-2 text-sm rounded bg-white text-gray-900 placeholder-gray-400 border border-gray-200" />
                            <input type="url" placeholder="URL" value={link.url} onChange={e => updateCustomLink(idx, 'url', e.target.value)} className="w-full sm:flex-1 px-3 py-2 text-sm rounded bg-white text-gray-900 placeholder-gray-400 border border-gray-200" />
                            <button type="button" onClick={() => removeCustomLink(idx)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-500 hover:bg-red-50 rounded" title="Remove Link">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={addCustomLink} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-lg transition-colors border border-gray-200 border-dashed">
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                </Accordion>

                <Accordion title="4. Design & Theme" isOpen={openAccordion === 'design'} onToggle={() => toggleAccordion('design')}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Theme Style</label>
                      <select value={theme} onChange={(e) => setTheme(e.target.value)} className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                        <option value="dark">Matte Obsidian (Default)</option>
                        <option value="light">Frosted Silver (Standard)</option>
                        <option value="glass">Glassmorphism (Premium)</option>
                        <option value="gold">Executive Gold (Luxury Metallic)</option>
                        <option value="cyberpunk">Cyberpunk Neon (Advanced)</option>
                        <option value="holographic">Holographic (Iridescent)</option>
                        <option value="sapphire">Dark Sapphire (Deep Blue)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Back Side Details (For 3D Flip)</label>
                      <textarea value={backDetails} onChange={(e) => setBackDetails(e.target.value)} rows={3} placeholder="Add a quote, summary, or extra details for the back of the card..." className="block w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="5. Advanced Settings" isOpen={openAccordion === 'advanced'} onToggle={() => toggleAccordion('advanced')}>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Background Music (Optional)</label>
                    
                    <div className="flex gap-2">
                      <select value={bgMusic} onChange={(e) => {
                        setBgMusic(e.target.value);
                        setIsPreviewPlaying(false);
                        if (audioRef.current) {
                          audioRef.current.pause();
                          audioRef.current.currentTime = 0;
                        }
                      }} className="flex-1 px-4 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                        <option value="none">No Music</option>
                        <option value="lofi">Lo-Fi Chill</option>
                        <option value="corporate">Corporate Ambient</option>
                        <option value="acoustic">Acoustic Guitar</option>
                        <option value="synthwave">Synthwave Retro</option>
                        <option value="ambient">Deep Ambient</option>
                      </select>
                      {bgMusic !== 'none' && (
                        <button type="button" onClick={togglePreviewMusic} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center font-bold border border-gray-200">
                          {isPreviewPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Audio defaults to muted on load.</p>
                  </div>
                </Accordion>
              </form>
            </div>
            

          </div>
          
          {/* RIGHT: PREVIEW */}
          <div className="w-full lg:w-[40%] flex flex-col">
            <div className="sticky top-8 flex flex-col items-center pb-8">
              
              {/* Share & Open Bar */}
              <div className="w-full max-w-[340px] mb-6 flex flex-col gap-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 flex gap-1 items-center">
                  <div className="bg-gray-50 px-3 py-2 rounded-lg flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500 font-medium truncate">{fullUrl}</p>
                  </div>
                  <button onClick={() => {
                    navigator.clipboard.writeText(fullUrl).catch(() => {
                      const textArea = document.createElement("textarea");
                      textArea.value = fullUrl;
                      document.body.appendChild(textArea);
                      textArea.select();
                      try { document.execCommand('copy'); } catch(e) {}
                      textArea.remove();
                    });
                    alert("Copied!");
                  }} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Copy Link">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                  <a href={fullUrl} target="_blank" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Open Link">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-center justify-center">
                  <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Share QR Code</p>
                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <QRCode value={fullUrl} size={100} bgColor="#ffffff" fgColor="#000000" level="Q" />
                  </div>
                </div>
              </div>
              
              {/* Audio Engine */}
              {bgMusic && bgMusic !== 'none' && (
                <audio 
                  ref={audioRef}
                  key={bgMusic} 
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  src={
                    {
                      lofi: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                      corporate: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                      acoustic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                      synthwave: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                      ambient: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                    }[bgMusic]
                  } 
                />
              )}

              {/* Realistic iPhone Frame */}
              <div className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-gray-900 p-[12px] shadow-2xl ring-1 ring-gray-900/10 flex-shrink-0 mx-auto border-4 border-gray-800">
                 {/* Hardware elements */}
                 <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-gray-900 rounded-b-[1.2rem] z-50 flex items-center justify-end px-3">
                   <div className="w-2 h-2 rounded-full bg-black/50 border border-white/10 shadow-inner"></div>
                 </div>
                 <div className="absolute left-[-4px] top-32 w-1 h-12 bg-gray-700 rounded-l-sm"></div>
                 <div className="absolute left-[-4px] top-48 w-1 h-16 bg-gray-700 rounded-l-sm"></div>
                 <div className="absolute left-[-4px] top-68 w-1 h-16 bg-gray-700 rounded-l-sm"></div>
                 <div className="absolute right-[-4px] top-40 w-1 h-24 bg-gray-700 rounded-r-sm"></div>

                 {/* Screen */}
                 <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col" style={{ background: phoneBg }}>
                    
                    {/* EXHIBITION GALLERY LAYOUT FOR PREVIEW */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden px-4 pb-20">
                      
                      {/* Top Left Status Badge */}
                      {statusBadge && (
                        <div className="absolute top-8 left-6 z-20">
                          <span className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold tracking-widest uppercase text-[10px] rounded-full shadow-2xl">
                            {statusBadge}
                          </span>
                        </div>
                      )}

                      {/* Centerpiece 3D Card */}
                      <div className="relative w-full aspect-[1.58/1] perspective-1000 group z-10"
                             onMouseEnter={() => setIsSpinPaused(true)}
                             onMouseLeave={() => setIsSpinPaused(false)}>
                        <div className={`w-full h-full relative transition-all duration-1000 transform-style-3d ${
                            isAutoSpinning ? 'animate-spin3d' : ''
                          } ${isSpinPaused ? 'paused' : ''} ${!isAutoSpinning && isFlipped ? 'rotate-y-180' : ''}`}
                             onClick={(e) => {
                                 if ((e.target as any).closest('button')) return;
                                 setIsAutoSpinning(false);
                                 setIsFlipped(!isFlipped);
                             }}>
                          
                          {/* 3D THICKNESS LAYERS */}
                          {[...Array(6)].map((_, i) => (
                            <div key={i} 
                                 className="absolute inset-0 rounded-3xl border"
                                 style={{ 
                                   background: cardMaterialBg, 
                                   borderColor: isDarkText ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                                   transform: `translateZ(-${i + 1}px)`,
                                   filter: 'brightness(0.7)'
                                 }} 
                            />
                          ))}

                          {/* FRONT OF CARD */}
                          <div className="absolute inset-0 rounded-3xl p-5 flex flex-col justify-between backface-hidden border"
                               style={{ 
                                  background: cardMaterialBg, 
                                  borderColor: isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                                  boxShadow: typeof glowShadow !== 'undefined' ? glowShadow : 'none',
                                  transform: 'translateZ(1px)'
                               }}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 rounded-3xl pointer-events-none"></div>
                            
                            <div className="flex justify-between items-start relative z-10">
                              {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="h-8 max-w-[100px] object-contain rounded" />
                              ) : (
                                <div className={`font-bold tracking-widest text-[10px] uppercase ${isDarkText ? 'text-gray-900' : 'text-white'}`}>{company || 'COMPANY'}</div>
                              )}
                              
                              {!isAutoSpinning && (
                                <button onClick={toggleFlip} className={`p-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur transition-colors ${isDarkText ? 'text-gray-900' : 'text-white'}`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </button>
                              )}
                            </div>
                            
                            <div className="relative z-10 flex items-end justify-between">
                              <div className="flex flex-col">
                                <h2 className={`text-xl font-black tracking-wide leading-tight ${isDarkText ? 'text-gray-900' : 'text-white'}`}>{name || 'Your Name'}</h2>
                                <p className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${isDarkText ? 'text-gray-700' : 'text-white/80'}`}>{jobTitle || 'Job Title'}</p>
                                
                                <div className={`mt-2 flex flex-col gap-1 text-[9px] font-medium ${isDarkText ? 'text-gray-800' : 'text-white/90'}`}>
                                  {phone && <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> {phone}</span>}
                                  {email && <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> {email}</span>}
                                </div>
                              </div>
                              
                              {headshotUrl && (
                                <img src={headshotUrl} alt="Headshot" className="w-16 h-16 rounded-full border-[2px] border-white/40 object-cover shadow-xl" />
                              )}
                            </div>
                          </div>

                          {/* BACK OF CARD */}
                          <div className="absolute inset-0 rounded-3xl p-5 flex flex-col justify-center items-center backface-hidden border"
                               style={{ 
                                  background: cardMaterialBg, 
                                  borderColor: isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                                  boxShadow: typeof glowShadow !== 'undefined' ? glowShadow : 'none',
                                  transform: 'translateZ(-7px) rotateY(180deg)'
                               }}>
                            
                            {!isAutoSpinning && (
                              <button onClick={toggleFlip} className={`absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur transition-colors ${isDarkText ? 'text-gray-900' : 'text-white'}`}>
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                              </button>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 rounded-3xl pointer-events-none"></div>
                            <p className={`text-xs text-center leading-relaxed max-w-[90%] relative z-10 font-medium ${isDarkText ? 'text-gray-900' : 'text-white'}`}>
                              {backDetails || "No back details provided."}
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Floating Actions at Bottom (Preview scaled down) */}
                      <div className="absolute bottom-12 inset-x-0 px-4 flex flex-wrap items-center justify-center gap-2 z-30 pointer-events-none">
                        
                        <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
                          {resumeUrl && (
                            <div className={`px-4 py-2.5 rounded-full font-bold shadow-lg flex items-center justify-center gap-1 text-[10px] sm:text-xs flex-shrink-0 ${isDarkText ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                              <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l4-5h-3V4h-2v7H8l4 5zM20 18H4v-2H2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2h-2v2z"/></svg>
                              Resume
                            </div>
                          )}
                          
                          {customLinks.map((link, idx) => link.title && link.url ? (
                            <div key={idx} className={`px-4 py-2.5 backdrop-blur-xl border rounded-full font-bold shadow-lg text-[10px] sm:text-xs max-w-[140px] truncate flex-shrink-0 ${isDarkText ? 'bg-black/5 text-gray-900 border-black/10' : 'bg-white/10 text-white border-white/20'}`}>
                                {link.title}
                              </div>
                          ) : null)}
                        </div>
                        
                        <div className="w-px h-4 bg-white/20 hidden md:block mx-1"></div>
                        
                        <div className="pointer-events-auto">
                          <div className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-extrabold shadow-lg shadow-blue-500/40 flex items-center justify-center gap-1.5 text-[10px]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Save
                          </div>
                        </div>
                      </div>
                      
                      {/* Powered By SnapLink */}
                      <div className="absolute bottom-3 inset-x-0 flex justify-center z-20 pointer-events-none">
                        <div className="flex items-center gap-1 opacity-60">
                          <span className="text-[8px] text-white font-medium uppercase tracking-widest">Powered by</span>
                          <span className="text-[8px] text-white font-black tracking-tight">SnapLink</span>
                        </div>
                      </div>

                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      
          {/* Mobile Sticky Save Bar */}
          <div className="sm:hidden sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 p-4 mt-8 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <button onClick={handleSave} className="w-full py-3.5 bg-[#1a73e8] text-white text-[15px] font-bold rounded-xl hover:bg-[#1557b0] transition-colors shadow-lg shadow-blue-500/30">
              {isSaved ? '✨ Saved Successfully!' : 'Save Changes'}
            </button>
          </div>
</main>
      <Footer />

      


      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        
        @keyframes spin3d {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        .animate-spin3d {
          animation: spin3d 8s linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
