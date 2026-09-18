"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

// Advanced SVG Icons for the UI
const Icons = {
  verified: <svg className="w-5 h-5 text-blue-500 inline-block ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/></svg>,
  link: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>,
  video: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  product: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>,
  donation: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  secret: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>,
  arrowRight: <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
};

function isDarkColor(color: string) {
  if (!color) return false;
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness < 128;
}

export default function BioPageClient({ bioPage }: { bioPage: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Extra Feature: Secret Reveal State tracking
  const [revealedLinks, setRevealedLinks] = useState<Record<number, boolean>>({});

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';


  const handleLinkClick = async (e: React.MouseEvent, link: any) => {
    if (link.link_type === 'secret' && !revealedLinks[link.id]) {
      e.preventDefault();
      // Animate reveal
      setRevealedLinks(prev => ({ ...prev, [link.id]: true }));
      return;
    }

    try {
      await fetch(`${backendUrl}/api/analytics/track/${link.id}`, { method: 'POST' });
    } catch (err) {}
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div></div>;
  }

  if (error || !bioPage) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">{error}</div>;
  }

  const themeColor = bioPage.theme_color || '#1a1a1a';
  const isDark = isDarkColor(themeColor);

  return (
    <>
      <Head>
        <title>{bioPage.name} - SnapLink</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      
      <div 
        className="min-h-screen relative w-full flex flex-col items-center py-16 px-4 overflow-x-hidden font-sans selection:bg-white/30"
        style={{
          background: isDark 
            ? `radial-gradient(circle at 50% 0%, ${themeColor}, #050505)` 
            : `radial-gradient(circle at 50% 0%, ${themeColor}, #f8f9fa)`
        }}
      >
        {/* Background Ambient Glow FX */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-30" style={{ background: themeColor }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20" style={{ background: themeColor }}></div>
        </div>

        <div className="w-full max-w-[500px] z-10 flex flex-col items-center">
          
          {/* Profile Header */}
          <div className="relative mb-6 group cursor-pointer">
            <div className={`absolute -inset-1 rounded-full blur-md opacity-70 transition duration-1000 group-hover:duration-200 group-hover:opacity-100`} style={{ background: `linear-gradient(45deg, ${themeColor}, #fff)` }}></div>
            <div className="relative">
              {bioPage.profile_image_url ? (
                <img src={bioPage.profile_image_url} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-black/10 shadow-2xl" />
              ) : (
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl font-black shadow-2xl ${isDark ? 'bg-white/10 text-white border-4 border-white/5' : 'bg-black/5 text-black border-4 border-black/5'}`}>
                  {bioPage.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <h1 className={`text-2xl font-black tracking-tight flex items-center justify-center mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {bioPage.name}
            {Icons.verified}
          </h1>
          
          {bioPage.description && (
            <p className={`text-center font-medium mb-8 px-4 leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              {bioPage.description}
            </p>
          )}

          {/* Social Icons */}
          {(bioPage.twitter_url || bioPage.instagram_url || bioPage.github_url || bioPage.linkedin_url) && (
            <div className="flex justify-center gap-5 mb-10 w-full">
              {bioPage.twitter_url && (
                <a href={bioPage.twitter_url} target="_blank" className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-transform hover:scale-110 shadow-lg ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              )}
              {bioPage.instagram_url && (
                <a href={bioPage.instagram_url} target="_blank" className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-transform hover:scale-110 shadow-lg ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {bioPage.github_url && (
                <a href={bioPage.github_url} target="_blank" className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-transform hover:scale-110 shadow-lg ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              )}
              {bioPage.linkedin_url && (
                <a href={bioPage.linkedin_url} target="_blank" className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-transform hover:scale-110 shadow-lg ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Links Section */}
          <div className="w-full flex flex-col gap-4">
            {bioPage.links && bioPage.links.length > 0 ? (
              bioPage.links.map((link: any) => {
                let meta: any = {};
                try { if (link.metadata_json) meta = JSON.parse(link.metadata_json); } catch (e) {}

                // Base Card Styles using Glassmorphism
                const baseCardClass = `group relative w-full p-4 rounded-[24px] backdrop-blur-md shadow-lg border transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-between
                  ${isDark 
                    ? 'bg-white/[0.08] border-white/[0.1] hover:bg-white/[0.12]' 
                    : 'bg-white/80 border-black/[0.05] hover:bg-white'}`;
                
                const titleClass = `font-bold text-[16px] tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`;
                const subtitleClass = `text-[13px] font-medium mt-0.5 ${isDark ? 'text-white/60' : 'text-gray-500'}`;
                const iconContainerClass = `w-12 h-12 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 transition-transform group-hover:rotate-6
                  ${isDark ? 'bg-gradient-to-br from-white/20 to-white/5 text-white' : 'bg-gradient-to-br from-black/10 to-black/5 text-black'}`;

                // --- 1. THE EXTRA FEATURE: Secret Reveal Links ---
                if (link.link_type === 'secret' || meta.secret) {
                  const isRevealed = revealedLinks[link.id];
                  return (
                    <a 
                      key={link.id} 
                      href={isRevealed ? link.url : '#'} 
                      target={isRevealed ? "_blank" : "_self"}
                      onClick={(e) => handleLinkClick(e, link)}
                      className={baseCardClass + ` overflow-hidden ${!isRevealed ? 'cursor-pointer' : ''}`}
                    >
                      {!isRevealed && (
                        <div className="absolute inset-0 z-10 backdrop-blur-xl bg-black/40 flex flex-col items-center justify-center transition-opacity hover:bg-black/30">
                           <div className="flex items-center gap-2 text-white font-bold tracking-widest uppercase text-sm">
                              {Icons.secret} Tap to Reveal Secret
                           </div>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <div className={iconContainerClass.replace('bg-gradient-to-br', 'bg-gradient-to-tr from-pink-500 to-purple-500 text-white')}>
                           <span className="text-xl font-black">🎁</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={titleClass}>{link.title}</span>
                          <span className={subtitleClass}>{meta.subtitle || 'Exclusive Content'}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {Icons.arrowRight}
                      </div>
                    </a>
                  );
                }

                // --- 2. Product Links (Mini Store) ---
                if (link.link_type === 'product') {
                  return (
                    <a key={link.id} href={link.url} onClick={(e) => handleLinkClick(e, link)} target="_blank" className={`block w-full rounded-[28px] overflow-hidden shadow-xl border transition-all duration-300 transform hover:scale-[1.02] ${isDark ? 'bg-white/[0.08] border-white/[0.1]' : 'bg-white border-black/[0.05]'}`}>
                      {meta.image_url && (
                        <div className="w-full h-48 relative overflow-hidden group">
                          <img src={meta.image_url} alt={link.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          {meta.price && (
                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white font-black px-4 py-2 rounded-xl border border-white/20">
                              {meta.price}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex flex-col text-left">
                          <h3 className={`font-bold text-[18px] tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{link.title}</h3>
                          <span className={subtitleClass}>Shop my collection</span>
                        </div>
                        <div className={`px-5 py-2.5 rounded-xl font-bold text-sm ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                          Buy Now
                        </div>
                      </div>
                    </a>
                  );
                }

                // --- 3. Video Embed Links ---
                if (link.link_type === 'video') {
                  return (
                    <div key={link.id} className={`w-full rounded-[28px] overflow-hidden shadow-xl border ${isDark ? 'bg-white/[0.08] border-white/[0.1]' : 'bg-white border-black/[0.05]'}`}>
                      <div className={`p-4 flex items-center font-bold tracking-tight text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mr-3">
                           {Icons.video}
                        </div>
                        {link.title}
                      </div>
                      <div className="aspect-w-16 aspect-h-9 w-full bg-black">
                        <iframe src={link.url} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                      </div>
                    </div>
                  );
                }

                // --- 4. Premium Standard Link ---
                // Render with Subtitle and Icon Support
                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank"
                    onClick={(e) => handleLinkClick(e, link)}
                    className={baseCardClass}
                  >
                    <div className="flex items-center">
                      <div className={iconContainerClass}>
                         {/* Check if user provided an emoji/image in metadata, else use default */}
                         {meta.icon ? (
                            meta.icon.startsWith('http') ? <img src={meta.icon} className="w-6 h-6 rounded" /> : <span className="text-xl">{meta.icon}</span>
                         ) : Icons.link}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className={titleClass}>{link.title}</span>
                        {meta.subtitle && <span className={subtitleClass}>{meta.subtitle}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {Icons.arrowRight}
                    </div>
                  </a>
                );
              })
            ) : (
              <div className={`p-8 text-center rounded-[24px] ${isDark ? 'bg-white/5 text-white/50' : 'bg-black/5 text-black/50'}`}>
                No links added yet.
              </div>
            )}
          </div>

          <div className="mt-16 mb-8 text-center">
             <a href="https://snaplink.in" target="_blank" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors backdrop-blur-md ${isDark ? 'bg-white/10 text-white/50 hover:text-white hover:bg-white/20' : 'bg-black/5 text-black/50 hover:text-black hover:bg-black/10'}`}>
               Powered by SnapLink
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
             </a>
          </div>

        </div>
      </div>
    </>
  );
}
