"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

// Advanced SVG Icons for the UI
const Icons = {
  verified: <svg className="w-[18px] h-[18px] text-[#1da1f2] inline-block ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/></svg>,
  link: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>,
  arrowRight: <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>,
  globe: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>,
  document: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
  twitter: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
  instagram: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  youtube: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  mail: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
  github: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
};

// Helper to determine the best icon for a URL
const getIconForUrl = (url: string) => {
  if (!url) return Icons.link;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return Icons.twitter;
  if (lowerUrl.includes('instagram.com')) return Icons.instagram;
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return Icons.youtube;
  if (lowerUrl.includes('mailto:')) return Icons.mail;
  if (lowerUrl.includes('github.com')) return Icons.github;
  if (lowerUrl.includes('linkedin.com')) return Icons.linkedin;
  if (lowerUrl.includes('blog') || lowerUrl.includes('medium') || lowerUrl.includes('substack')) return Icons.document;
  return Icons.globe;
};

// Helper to get a clean subtitle from URL
const getDomainSubtitle = (url: string) => {
  try {
    if (url.startsWith('mailto:')) return url.replace('mailto:', '');
    const domain = new URL(url).hostname.replace('www.', '');
    // If it's a social profile, try to extract the username
    if (domain === 'twitter.com' || domain === 'x.com') {
       const parts = new URL(url).pathname.split('/');
       if (parts[1]) return `@${parts[1]}`;
    }
    if (domain === 'instagram.com') {
       const parts = new URL(url).pathname.split('/');
       if (parts[1]) return `@${parts[1]}`;
    }
    return domain;
  } catch (e) {
    return url;
  }
};


export default function BioPageClient({ bioPage }: { bioPage: any }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";

  const handleLinkClick = async (e: React.MouseEvent, link: any) => {
    try {
      await fetch(`${backendUrl}/api/analytics/track/${link.id}`, { method: 'POST' });
    } catch (err) {}
  };

  if (!bioPage) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-bold">Profile not found</div>;
  }

  const themeColor = bioPage.theme_color || '#8b5cf6';
  const themeType = bioPage.theme_type || 'dark-glass';

  const themes: Record<string, any> = {
    'dark-glass': {
      bg: 'bg-[#0a0a0f]',
      text: 'text-white',
      textSec: 'text-[#b0a8c2]',
      textMuted: 'text-white/40',
      linkBg: 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] backdrop-blur-lg shadow-lg',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/40 font-medium',
      iconBg: 'bg-white/5 border border-white/10 text-white',
      featuredClass: 'bg-gradient-to-r from-[#ff4b72] to-[#8b2cff] shadow-[0_4px_20px_rgba(139,44,255,0.3)] text-white',
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#0a0a0f]',
      showMesh: true,
      socialBg: 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-white',
    },
    'light-glass': {
      bg: 'bg-[#f8f9fa]',
      text: 'text-gray-900',
      textSec: 'text-gray-600',
      textMuted: 'text-gray-400',
      linkBg: 'bg-white/60 border border-white hover:bg-white/90 backdrop-blur-xl shadow-md',
      linkText: 'text-gray-900 font-bold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-white border border-gray-100 text-gray-900 shadow-sm',
      featuredClass: `bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg text-white`,
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#f8f9fa]',
      showMesh: true,
      socialBg: 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm',
    },
    'solid': {
      bg: '', // Overridden by style={{ backgroundColor: themeColor }}
      text: 'text-white',
      textSec: 'text-white/90',
      textMuted: 'text-white/60',
      linkBg: 'bg-black/10 hover:bg-black/20 border border-transparent shadow-sm',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/70 font-medium',
      iconBg: 'bg-black/20 text-white',
      featuredClass: 'bg-white text-black shadow-lg',
      featuredIconBg: 'bg-black/10 text-black',
      profileBg: 'transparent',
      showMesh: false,
      socialBg: 'bg-black/10 hover:bg-black/20 text-white border-transparent',
    },
    'neo-brutalism': {
      bg: 'bg-[#FDF9F1]',
      text: 'text-black',
      textSec: 'text-black',
      textMuted: 'text-gray-700',
      linkBg: 'bg-white border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] shadow-[2px_2px_0_0_#000] rounded-none',
      linkText: 'text-black font-black uppercase tracking-tight',
      linkSub: 'text-gray-800 font-bold',
      iconBg: 'bg-[#FFEB3B] border-2 border-black text-black rounded-none',
      featuredClass: 'bg-[#FF90E8] border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] shadow-[2px_2px_0_0_#000] rounded-none text-black',
      featuredIconBg: 'bg-white border-2 border-black text-black rounded-none',
      profileBg: 'bg-[#FDF9F1]',
      showMesh: false,
      socialBg: 'bg-white border-2 border-black hover:bg-[#FFEB3B] text-black hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#000]',
    },
    'minimal': {
      bg: 'bg-white',
      text: 'text-gray-900',
      textSec: 'text-gray-500',
      textMuted: 'text-gray-400',
      linkBg: 'bg-transparent border border-gray-200 hover:border-gray-400 rounded-lg',
      linkText: 'text-gray-900 font-semibold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-gray-50 text-gray-700 border-none rounded-lg',
      featuredClass: 'bg-gray-900 text-white rounded-lg',
      featuredIconBg: 'bg-white/20 text-white rounded-lg',
      profileBg: 'bg-white',
      showMesh: false,
      socialBg: 'bg-transparent border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full',
    }
  };

  const t = themes[themeType] || themes['dark-glass'];

  return (
    <>
      <Head>
        <title>{bioPage.title || bioPage.alias} - SnapLink</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      
      <div 
        className={`min-h-screen relative w-full flex flex-col items-center py-16 px-4 overflow-x-hidden font-sans ${t.bg}`}
        style={themeType === 'solid' ? { backgroundColor: themeColor } : {}}
      >
        
        {/* Background Premium Mesh Gradient */}
        {t.showMesh && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {themeType === 'dark-glass' ? (
              <>
                <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-40 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full blur-[120px] opacity-30 mix-blend-screen" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full blur-[90px] opacity-20 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(29,161,242,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
              </>
            ) : (
              <>
                <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-[0.15] mix-blend-multiply" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full blur-[120px] opacity-[0.15] mix-blend-multiply" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
              </>
            )}
          </div>
        )}

        <div className="w-full max-w-[480px] z-10 flex flex-col items-center">
          
          {/* Settings / Menu Icon (Top Right) */}
          <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition ${t.iconBg}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
          </div>

          {/* Profile Picture */}
          <div className="relative mb-5 mt-4">
            {themeType === 'dark-glass' && (
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-[#ff6b6b] via-[#c0392b] to-[#8e44ad] p-[3px] shadow-[0_0_20px_rgba(142,68,173,0.4)]">
                 <div className="w-full h-full bg-[#0a0a0f] rounded-full"></div>
              </div>
            )}
            
            <div className="relative">
              {bioPage.profile_image_url ? (
                <img src={bioPage.profile_image_url} alt="Profile" className={`w-[104px] h-[104px] rounded-full object-cover border-2 ${themeType === 'neo-brutalism' ? 'border-4 border-black rounded-none shadow-[4px_4px_0_0_#000]' : 'border-transparent'}`} style={themeType !== 'neo-brutalism' ? { borderColor: t.profileBg } : {}} />
              ) : (
                <div className={`w-[104px] h-[104px] flex items-center justify-center text-4xl font-black ${themeType === 'neo-brutalism' ? 'border-4 border-black bg-[#FF90E8] text-black shadow-[4px_4px_0_0_#000]' : 'rounded-full bg-gray-200 text-gray-500'}`} style={themeType !== 'neo-brutalism' && !t.bg.includes('white') ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } : {}}>
                  {(bioPage.title || bioPage.alias || "S").charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Name & Verified Badge */}
          <h1 className={`text-[22px] font-bold tracking-tight flex items-center justify-center mb-1 drop-shadow-sm ${t.text}`}>
            {bioPage.title || bioPage.alias}
            {Icons.verified}
          </h1>
          
          {/* Job Title / Description */}
          <p className={`text-[15px] font-medium mb-4 ${t.textSec}`}>
            @{bioPage.alias}
          </p>

          {/* Long Bio */}
          {bioPage.bio_text && (
            <p className={`text-center text-[14px] leading-[1.6] mb-8 px-6 max-w-[380px] ${t.textMuted}`}>
              {bioPage.bio_text}
            </p>
          )}

          {/* Social Icons Row */}
          {(bioPage.twitter_url || bioPage.instagram_url || bioPage.github_url || bioPage.linkedin_url) && (
            <div className="flex justify-center gap-4 mb-10 w-full px-4">
              
              {bioPage.resume_url && (
                <a href={bioPage.resume_url.startsWith('http') ? bioPage.resume_url : `${backendUrl}${bioPage.resume_url.startsWith('/') ? '' : '/'}${bioPage.resume_url}`} target="_blank" download className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`} title="Download Resume">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </a>
              )}

              {bioPage.twitter_url && (
                <a href={bioPage.twitter_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.twitter}
                </a>
              )}
              {bioPage.github_url && (
                <a href={bioPage.github_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.github}
                </a>
              )}
              {bioPage.linkedin_url && (
                <a href={bioPage.linkedin_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.linkedin}
                </a>
              )}
              {bioPage.instagram_url && (
                <a href={bioPage.instagram_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.instagram}
                </a>
              )}
              {bioPage.contact_email && (
                <a href={`mailto:${bioPage.contact_email}`} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Links Stack */}
          <div className="w-full flex flex-col gap-[14px]">
            {bioPage.links && bioPage.links.length > 0 ? (
              bioPage.links.map((link: any, index: number) => {
                
                const isFeatured = index === 0;
                
                // Construct the link classes based on the active theme
                const cardBase = "group relative w-full p-4 transition-all duration-300 transform flex items-center justify-between";
                const borderRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-lg' : 'rounded-[20px]';
                
                const cardClass = isFeatured 
                  ? `${cardBase} ${borderRad} ${t.featuredClass}`
                  : `${cardBase} ${borderRad} ${t.linkBg}`;

                const iconBase = "w-10 h-10 flex items-center justify-center mr-[14px] flex-shrink-0";
                const iconRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-lg' : 'rounded-[12px]';
                
                const iconContainerClass = isFeatured
                  ? `${iconBase} ${iconRad} ${t.featuredIconBg}`
                  : `${iconBase} ${iconRad} ${themeType === 'dark-glass' ? '' : t.iconBg}`;

                const titleClass = `text-[15.5px] tracking-tight mb-0.5 ${isFeatured ? (themeType === 'solid' ? 'text-black' : 'text-white') : t.linkText} ${themeType === 'neo-brutalism' ? 'font-black uppercase' : 'font-bold'}`;
                const subtitleClass = `text-[12px] ${isFeatured ? (themeType === 'solid' ? 'text-black/70' : 'text-white/80') : t.linkSub} ${themeType === 'neo-brutalism' ? 'font-bold text-black/70' : 'font-medium'}`;

                const subtitle = getDomainSubtitle(link.url);
                const icon = getIconForUrl(link.url);

                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank"
                    onClick={(e) => handleLinkClick(e, link)}
                    className={cardClass}
                  >
                    <div className="flex items-center">
                      <div className={iconContainerClass} style={!isFeatured && themeType === 'dark-glass' ? { background: themeColor, color: 'white' } : {}}>
                         {icon}
                      </div>
                      <div className="flex flex-col text-left justify-center">
                        <span className={titleClass}>{link.title}</span>
                        <span className={subtitleClass}>{subtitle}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4 pl-2">
                      <svg className={`w-[18px] h-[18px] ${isFeatured ? (themeType === 'solid' ? 'text-black' : 'text-white') : t.textMuted}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className={`p-8 text-center rounded-[24px] border ${t.linkBg} ${t.textMuted}`}>
                No links added yet.
              </div>
            )}
          </div>

          {/* Footer Footer Footer */}
          <div className={`mt-14 mb-8 text-center flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity ${t.textMuted}`}>
             <div className="text-[13px] font-medium">
                Made with <span className="text-red-500 mx-0.5">❤️</span> by {(bioPage.title || bioPage.alias || 'Creator').split(' ')[0]}
             </div>
             <div className="text-[11px] opacity-70">
                © {new Date().getFullYear()} All rights reserved
             </div>
          </div>

        </div>
      </div>
    </>
  );
}
