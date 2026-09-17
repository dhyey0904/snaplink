'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/utils/api';

export default function VCardDashboard() {
  const [alias, setAlias] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [theme, setTheme] = useState('dark');
  const [socialLinks, setSocialLinks] = useState('{}');
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const SHORT_LINK_DOMAIN = process.env.NEXT_PUBLIC_SHORT_LINK_DOMAIN || 'http://localhost:3000/v/';

  useEffect(() => {
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
        }
      } catch (err: any) {
        if (err.message !== 'No business card found') {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
          social_links: socialLinks
        })
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving card');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${SHORT_LINK_DOMAIN}${alias}`);
    alert('Card URL Copied to clipboard!');
  };

  const handleShare = async () => {
    const fullUrl = `${SHORT_LINK_DOMAIN}${alias}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Business Card`,
          text: `Here is my digital business card!`,
          url: fullUrl,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Here is my digital business card! ' + fullUrl)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a73e8]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Navbar */}
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
              <Link href="/dashboard/links" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors py-5">
                URL Shortener
              </Link>
              <Link href="/dashboard/vcard" className="text-sm font-medium text-[#1a73e8] border-b-2 border-[#1a73e8] py-5">
                Business Card
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
        
        {/* Editor Section - Left Side */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-8 rounded-3xl border border-[#dadce0] shadow-sm">
            <h1 className="text-2xl font-bold text-[#202124] mb-2">3D Digital Business Card</h1>
            <p className="text-[#5f6368] mb-8">Design an interactive, futuristic 3D card that users can save directly to their phone contacts.</p>

            <form onSubmit={handleSave} className="space-y-6">
              {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>}
              {isSaved && <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 font-medium">✓ Card saved successfully!</div>}
              
              <div>
                <label className="block text-sm font-bold text-[#202124] mb-2">Card URL Alias</label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-[#dadce0] bg-gray-50 text-gray-500 sm:text-sm font-medium">
                    snaplinks.in/v/
                  </span>
                  <input
                    type="text"
                    required
                    value={alias}
                    onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-name"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-white border border-[#dadce0] focus:ring-[#1a73e8] focus:border-[#1a73e8] sm:text-sm"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Only letters, numbers, and hyphens.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#202124] mb-2">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="block w-full px-4 py-2 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#202124] mb-2">Job Title</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" className="block w-full px-4 py-2 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#202124] mb-2">Company</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google" className="block w-full px-4 py-2 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#202124] mb-2">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" className="block w-full px-4 py-2 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#202124] mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="block w-full px-4 py-2 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#202124] mb-2">WhatsApp Number (Optional)</label>
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+1234567890 (No spaces)" className="block w-full px-4 py-2 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#202124] mb-2">Card Theme</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} className="block w-full px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]">
                  <option value="dark">Midnight Black (Glass)</option>
                  <option value="light">Frosted Silver (Glass)</option>
                  <option value="gold">Executive Gold (Metallic)</option>
                </select>
              </div>

              <button type="submit" className="w-full py-4 bg-[#1a73e8] text-white rounded-xl font-bold hover:bg-[#1557b0] transition-colors shadow-lg">
                Save & Update Card
              </button>
              
              {alias && (
                <div className="mt-4 text-center">
                  <a href={`/v/${alias}`} target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline font-medium">
                    Open public card in new tab ↗
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Live Preview Section - Right Side */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-[#e8f0fe] rounded-3xl border border-blue-100 sticky top-24 overflow-hidden perspective-1000">
          
          {/* Simulated 3D Card Preview */}
          <div className="relative w-full max-w-sm aspect-[1.6/1] rounded-2xl shadow-2xl transition-all duration-300 transform rotate-y-[-10deg] rotate-x-[10deg] hover:rotate-y-0 hover:rotate-x-0"
               style={{
                 background: theme === 'dark' ? 'linear-gradient(135deg, #111, #222)' : theme === 'gold' ? 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7)' : 'linear-gradient(135deg, #fff, #f0f2f5)',
                 color: theme === 'light' ? '#111' : '#fff',
                 border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
               }}>
            
            {/* Glassmorphism shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/30 rounded-2xl"></div>

            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold tracking-wider">{name || 'YOUR NAME'}</h2>
                <p className="text-sm font-medium opacity-80 mt-1 uppercase tracking-widest">{jobTitle || 'JOB TITLE'}</p>
              </div>
              
              <div className="text-right">
                <p className="font-bold tracking-widest text-lg">{company || 'COMPANY LTD'}</p>
                <div className="mt-2 text-xs opacity-70 flex flex-col gap-1 items-end">
                  {phone && <span>{phone}</span>}
                  {email && <span>{email}</span>}
                </div>
              </div>
            </div>
            
            {/* Contact Chip Overlay */}
            <div className="absolute -bottom-4 right-6 bg-[#1a73e8] text-white px-4 py-2 rounded-full font-bold shadow-lg text-xs flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Save to Contacts
            </div>

          </div>

          {/* Share Action Buttons */}
          {alias && (
            <div className="mt-8 flex gap-4 w-full max-w-sm">
              <button 
                onClick={handleCopy}
                className="flex-1 py-3 bg-white text-[#202124] border border-[#dadce0] rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                Copy Link
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 py-3 bg-[#1a73e8] text-white rounded-xl font-bold shadow-md hover:bg-[#1557b0] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                Share Card
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
