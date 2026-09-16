"use client";

import { useState, useEffect } from "react";

export default function BioPageClient({ bioPage }: { bioPage: any }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    e.preventDefault();
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const themeColor = bioPage.theme_color || "#3B82F6";

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
        <div className="w-[728px] h-[90px] bg-gray-300 flex items-center justify-center border border-gray-400 mb-8 max-w-full">
          <span className="text-gray-500 font-medium">Advertisement Space</span>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Snap<span className="text-blue-600">Link</span> Bio</h1>
          <div className="py-6">
            <p className="text-gray-600 mb-4">Viewing profile for <strong>{bioPage.title}</strong></p>
            <div className="text-4xl font-extrabold text-blue-600 mb-4">{countdown}</div>
            <button disabled className="mt-2 px-6 py-2 bg-gray-200 text-gray-400 font-medium w-full rounded cursor-not-allowed">
              Skip Ad in {countdown}s
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColor }}>
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
            <a href={`mailto:${bioPage.contact_email}`} className="block w-full p-4 bg-[#202124] text-white rounded-2xl shadow-sm text-center font-medium hover:bg-[#3c4043] transition-all border border-[#202124] flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Email Me
            </a>
          )}
          {bioPage.resume_url && (
            <a href={bioPage.resume_url} target="_blank" className="block w-full p-4 bg-white text-[#202124] rounded-2xl shadow-sm text-center font-medium hover:bg-gray-50 transition-all border-2 border-[#202124] flex items-center justify-center gap-2">
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
