"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

export default function BioPageClient({ bioPage }: { bioPage: any }) {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    e.preventDefault();
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const themeColor = bioPage.theme_color || "#3B82F6";
  const adSensePubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID; // e.g., ca-pub-1234567890123456

  useEffect(() => {
    // Initialize AdSense if ad slot is rendered
    if (bioPage.ad_enabled && adSensePubId) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [bioPage.ad_enabled, adSensePubId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColor }}>
      {/* AdSense Script */}
      {bioPage.ad_enabled && adSensePubId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSensePubId}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
      {/* Top Header Area */}
      <div className="max-w-xl mx-auto px-4 pt-16 pb-8 text-center text-white">
        {bioPage.profile_image_url ? (
          <img src={bioPage.profile_image_url} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg border-2 border-white" />
        ) : (
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-lg">
            {bioPage.title.charAt(0)}
          </div>
        )}
        <h1 className="font-extrabold text-2xl tracking-tight mb-2">{bioPage.title}</h1>
        {bioPage.bio_text && <p className="text-white text-opacity-90">{bioPage.bio_text}</p>}
      </div>

      {/* Links Area */}
      <div className="bg-[#f8f9fa] min-h-[70vh] rounded-t-[3rem] pt-10 px-4 pb-16 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* Special Buttons */}
          {bioPage.contact_email && (
            <a 
              href={`mailto:${bioPage.contact_email}`} 
              onClick={(e) => {
                try {
                  navigator.clipboard.writeText(bioPage.contact_email);
                  setEmailCopied(true);
                  setTimeout(() => setEmailCopied(false), 3000);
                } catch (err) {}
              }}
              className="block w-full p-4 bg-[#202124] text-white rounded-2xl shadow-sm text-center font-medium hover:bg-[#3c4043] transition-all border border-[#202124] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              {emailCopied ? "Email Copied!" : "Contact Me"}
            </a>
          )}
          {bioPage.resume_url && (
            <a href={bioPage.resume_url} download="resume.pdf" className="block w-full p-4 bg-white text-[#202124] rounded-2xl shadow-sm text-center font-medium hover:bg-gray-50 transition-all border-2 border-[#202124] flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Download Resume
            </a>
          )}

          {bioPage.links && bioPage.links.length > 0 ? (
            bioPage.links.map((link: any) => (
              <a 
                key={link.id} 
                href={link.url} 
                onClick={(e) => handleLinkClick(e, link)}
                className="block w-full p-4 bg-white rounded-2xl shadow-sm text-center font-medium text-[#202124] hover:shadow-md hover:-translate-y-1 transition-all border border-[#dadce0]"
              >
                {link.title}
              </a>
            ))
          ) : (
            <p className="text-center text-[#5f6368]">No links added yet.</p>
          )}

          {/* Social Icons */}
          {(bioPage.twitter_url || bioPage.instagram_url || bioPage.github_url || bioPage.linkedin_url) && (
            <div className="flex justify-center gap-6 pt-6 pb-2">
              {bioPage.twitter_url && (
                <a href={bioPage.twitter_url} target="_blank" className="text-[#5f6368] hover:text-[#1da1f2] transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              )}
              {bioPage.instagram_url && (
                <a href={bioPage.instagram_url} target="_blank" className="text-[#5f6368] hover:text-[#e1306c] transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {bioPage.github_url && (
                <a href={bioPage.github_url} target="_blank" className="text-[#5f6368] hover:text-[#202124] transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              )}
              {bioPage.linkedin_url && (
                <a href={bioPage.linkedin_url} target="_blank" className="text-[#5f6368] hover:text-[#0077b5] transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
            </div>
          )}
          
          {/* AdSense Ad Unit */}
          {bioPage.ad_enabled && adSensePubId && (
            <div className="pt-8 text-center w-full overflow-hidden flex justify-center">
              <ins className="adsbygoogle"
                   style={{ display: "block", minWidth: "320px", maxWidth: "100%", height: "90px" }}
                   data-ad-client={adSensePubId}
                   data-ad-slot="4096463539"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          )}

          <div className="pt-12 text-center">
            <a href="https://snaplinks.in" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
              Powered by SnapLink
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
