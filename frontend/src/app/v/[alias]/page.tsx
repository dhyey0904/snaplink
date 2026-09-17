'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';

export default function PublicBusinessCard() {
  const { alias } = useParams();
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 3D Tilt refs
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
        const res = await fetch(`${backendUrl}/api/vcard/${alias}`);
        if (!res.ok) throw new Error('Card not found');
        const data = await res.json();
        setCard(data);
      } catch (err: any) {
        setError('This digital business card does not exist.');
      } finally {
        setLoading(false);
      }
    };
    if (alias) fetchCard();
  }, [alias]);

  // Handle 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - cardRect.left; // x position within the element
    const y = e.clientY - cardRect.top;  // y position within the element
    
    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; // Max rotation 15deg
    const rotateY = ((x - centerX) / centerX) * 15;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    cardRef.current.style.transition = 'transform 0.5s ease-out';
  };
  
  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'none'; // Remove transition for instant tracking
  };

  // Generate and Download .vcf file
  const handleSaveContact = () => {
    if (!card) return;
    
    // Construct vCard string
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${card.name || ''};;;
FN:${card.name || ''}
ORG:${card.company || ''}
TITLE:${card.job_title || ''}
TEL;TYPE=WORK,VOICE:${card.phone || ''}
TEL;TYPE=CELL,VOICE:${card.whatsapp || ''}
EMAIL;TYPE=PREF,INTERNET:${card.email || ''}
URL:${card.portfolio_url || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.name || 'Contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
  }

  if (error || !card) {
    return <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4"><p className="text-white text-xl">{error}</p></div>;
  }

  const isDark = card.theme_color === 'dark';
  const isGold = card.theme_color === 'gold';
  
  // Theme styling
  const bgStyle = isDark 
    ? 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' // Dark slate
    : isGold 
      ? 'linear-gradient(135deg, #1f1c18, #8e0e00)' // Deep red/black
      : 'linear-gradient(135deg, #e0eafc, #cfdef3)'; // Light frost

  const cardBgStyle = isDark
    ? 'linear-gradient(135deg, rgba(30,30,30,0.8), rgba(10,10,10,0.9))'
    : isGold
      ? 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))';

  const textColor = isLight(card.theme_color) ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight(card.theme_color) ? 'text-gray-600' : 'text-gray-300';

  function isLight(theme: string) {
    return theme === 'light';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8" style={{ background: bgStyle }}>
      
      {/* 3D Container */}
      <div className="perspective-1000 w-full max-w-md">
        
        {/* The Card */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className="relative w-full aspect-[1.6/1] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer border backdrop-blur-md"
          style={{ 
            background: cardBgStyle,
            borderColor: isLight(card.theme_color) ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            boxShadow: isGold ? '0 30px 60px -12px rgba(179, 135, 40, 0.4)' : '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s ease-out'
          }}
        >
          {/* Glare effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 rounded-3xl pointer-events-none rounded-3xl"></div>

          {/* Top Section */}
          <div className="z-10 transform-gpu" style={{ transform: 'translateZ(30px)' }}>
            <h1 className={`text-3xl sm:text-4xl font-black tracking-wider uppercase ${textColor} drop-shadow-md`}>
              {card.name || 'YOUR NAME'}
            </h1>
            <p className={`text-sm sm:text-base font-bold tracking-[0.2em] uppercase mt-2 ${subTextColor}`}>
              {card.job_title || 'YOUR TITLE'}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="z-10 transform-gpu text-right mt-12" style={{ transform: 'translateZ(20px)' }}>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-widest uppercase ${textColor}`}>
              {card.company || 'YOUR COMPANY'}
            </h2>
            
            <div className={`mt-4 text-xs sm:text-sm font-medium flex flex-col gap-1.5 items-end ${subTextColor}`}>
              {card.phone && (
                <div className="flex items-center gap-2">
                  <span>{card.phone}</span>
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
              )}
              {card.email && (
                <div className="flex items-center gap-2">
                  <span>{card.email}</span>
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 w-full max-w-sm space-y-4">
        <button 
          onClick={handleSaveContact}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 ${
            isGold ? 'bg-gradient-to-r from-[#bf953f] to-[#fbf5b7] text-black' : 
            isLight(card.theme_color) ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Save to Contacts
        </button>
        
        {card.whatsapp && (
          <a 
            href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.172c-1.848 0-3.662-.486-5.264-1.408l-.377-.218-3.91.102 1.047-3.815-.24-.383c-1.013-1.616-1.547-3.483-1.547-5.412 0-5.632 4.582-10.213 10.212-10.213 2.723 0 5.281 1.06 7.206 2.986a10.155 10.155 0 012.988 7.218c.002 5.632-4.577 10.213-10.212 10.213zm7.887-17.15c-2.106-2.107-4.908-3.268-7.887-3.268C6.012.754 1.135 5.634 1.135 11.649c0 1.93.504 3.81 1.464 5.467l-1.47 5.372 5.498-1.442c1.58.877 3.36 1.338 5.176 1.338h.004c6.015 0 10.893-4.877 10.893-10.892 0-2.915-1.133-5.656-3.197-7.714zm-3.125 10.183c-.347-.174-2.052-1.014-2.37-1.13-.319-.117-.552-.174-.784.173-.232.348-.897 1.13-.11 1.362-.198.232-.405.26-.752.087-.348-.174-1.465-.54-2.793-1.725-.333-.296-.759-.757-.96-1.092-.204-.334-.023-.514.15-.688.157-.158.347-.406.52-.608.175-.203.233-.348.348-.58.116-.233.058-.435-.029-.609-.087-.174-.785-1.892-1.074-2.593-.283-.684-.572-.59-.785-.601-.198-.01-.43-.012-.663-.012-.232 0-.609.087-.928.435-.319.348-1.218 1.19-1.218 2.9 0 1.71 1.246 3.363 1.42 3.595.174.232 2.451 3.743 5.939 5.25.829.358 1.476.572 1.98.732.833.264 1.593.226 2.193.137.671-.1 2.052-.84 2.342-1.652.29-.812.29-1.508.203-1.653-.087-.145-.318-.232-.665-.406z"></path></svg>
            Message on WhatsApp
          </a>
        )}
      </div>
      
      {/* Branding */}
      <div className="mt-12 text-center">
        <a href="/" className="text-sm font-medium opacity-50 hover:opacity-100 transition-opacity" style={{ color: isLight(card.theme_color) ? '#000' : '#fff' }}>
          Powered by SnapLink
        </a>
      </div>

    </div>
  );
}
