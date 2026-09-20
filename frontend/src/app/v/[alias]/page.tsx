'use client';

import { useEffect, useState, useRef } from 'react';
import AdOverlay from '@/components/AdOverlay';
import { useParams } from 'next/navigation';
import AdBanner from '@/components/AdBanner';

export default function PublicBusinessCard() {
  const { alias } = useParams();
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(true);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [isSpinPaused, setIsSpinPaused] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [adFinished, setAdFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
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

  const toggleFlip = (e?: any) => {
    if (e) e.preventDefault();
    setIsAutoSpinning(false);
    setIsFlipped(!isFlipped);
  };

  const handleSaveContact = () => {
    if (!card) return;
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${card.name || ''};;;\nFN:${card.name || ''}\nORG:${card.company || ''}\nTITLE:${card.job_title || ''}\nTEL;TYPE=WORK,VOICE:${card.phone || ''}\nTEL;TYPE=CELL,VOICE:${card.whatsapp || ''}\nEMAIL;TYPE=PREF,INTERNET:${card.email || ''}\nURL:${card.resume_url || ''}\nEND:VCARD`;
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
    return <div className="h-[100dvh] w-full bg-black flex items-center justify-center overflow-hidden"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
  }

  if (error || !card) {
    return <div className="h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-4 overflow-hidden"><p className="text-white text-xl">{error}</p></div>;
  }

  const theme = card.theme_color || 'dark';
  
  let customLinks: {title: string, url: string}[] = [];
  if (card.custom_links) {
    try { customLinks = JSON.parse(card.custom_links); } catch(e) {}
  }

  const bgStyle = (() => {
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
      case 'gold': return '0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)';
      case 'cyberpunk': return '0 0 40px rgba(255, 0, 204, 0.5), 0 0 80px rgba(51, 51, 153, 0.4)';
      case 'holographic': return '0 0 40px rgba(255, 154, 158, 0.5), 0 0 80px rgba(254, 207, 239, 0.4)';
      case 'sapphire': return '0 0 40px rgba(0, 78, 146, 0.5), 0 0 80px rgba(0, 4, 64, 0.4)';
      case 'glass': return '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.1)';
      case 'light': return '0 0 40px rgba(255, 255, 255, 0.5)';
      default: return '0 0 40px rgba(255, 255, 255, 0.1)';
    }
  })();
  
  const isDarkText = ['gold', 'glass', 'light', 'holographic'].includes(theme);

  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans relative overflow-hidden fixed inset-0" style={{ background: bgStyle }}>
      {!hasEntered && (
        <AdOverlay 
          actionText="Loading 3D Experience" 
          onComplete={() => {
            setHasEntered(true);
            if (card.bg_music && card.bg_music !== 'none') {
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio play failed", e));
                }
              }, 100);
            }
          }} 
        />
      )}
      
      {card.bg_music && card.bg_music !== 'none' && (
        <audio 
          ref={audioRef}
          key={card.bg_music} 
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
            }[card.bg_music as string]
          } 
        />
      )}

      {/* EXHIBITION GALLERY LAYOUT */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-8 pb-16 md:pb-20">
        
        {/* Top Left Status Badge */}
        {card.status_badge && (
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
            <span className="px-5 py-2 md:px-6 md:py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold tracking-widest uppercase text-[10px] md:text-xs rounded-full shadow-2xl">
              {card.status_badge}
            </span>
          </div>
        )}

        {/* Centerpiece 3D Card */}
        <div className="relative w-full max-w-[320px] sm:max-w-md md:max-w-xl lg:max-w-2xl aspect-[1.58/1] perspective-1000 group z-10"
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
            {[...Array(8)].map((_, i) => (
              <div key={i} 
                   className={`absolute inset-0 rounded-3xl border`}
                   style={{ 
                     background: cardMaterialBg, 
                     borderColor: isDarkText ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                     transform: `translateZ(-${i + 1}px)`,
                     filter: 'brightness(0.7)'
                   }} 
              />
            ))}

            {/* FRONT OF CARD */}
            <div className={`absolute inset-0 rounded-3xl p-5 md:p-8 flex flex-col justify-between backface-hidden border`}
                 style={{ 
                    background: cardMaterialBg, 
                    borderColor: isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                    boxShadow: typeof glowShadow !== 'undefined' ? glowShadow : 'none',
                    transform: 'translateZ(1px)'
                 }}>
              <div className={`absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 rounded-3xl pointer-events-none`}></div>
              
              <div className="flex justify-between items-start relative z-10">
                {card.logo_url ? (
                  <img src={card.logo_url} alt="Logo" className="h-8 md:h-12 max-w-[120px] md:max-w-[140px] object-contain rounded" />
                ) : (
                  <div className={`font-bold tracking-widest text-xs md:text-base uppercase ${isDarkText ? 'text-gray-900' : 'text-white'}`}>{card.company || 'COMPANY'}</div>
                )}
                
                {!isAutoSpinning && (
                  <button onClick={toggleFlip} className={`p-2 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur transition-colors ${isDarkText ? 'text-gray-900' : 'text-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  </button>
                )}
              </div>
              
              <div className="relative z-10 flex items-end justify-between">
                <div className="flex flex-col">
                  <h2 className={`text-2xl sm:text-3xl md:text-5xl font-black tracking-wide leading-tight ${isDarkText ? 'text-gray-900' : 'text-white'}`}>{card.name || 'Your Name'}</h2>
                  <p className={`text-xs md:text-base font-semibold uppercase tracking-widest mt-1 md:mt-2 ${isDarkText ? 'text-gray-700' : 'text-white/80'}`}>{card.job_title || 'Job Title'}</p>
                  
                  <div className={`mt-3 md:mt-4 flex flex-col gap-1 md:gap-1.5 text-[10px] md:text-sm font-medium ${isDarkText ? 'text-gray-800' : 'text-white/90'}`}>
                    {card.phone && <span className="flex items-center gap-2"><svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> {card.phone}</span>}
                    {card.email && <span className="flex items-center gap-2"><svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> {card.email}</span>}
                  </div>
                </div>
                
                {card.headshot_url && (
                  <img src={card.headshot_url} alt="Headshot" className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full border-[3px] border-white/40 object-cover shadow-2xl" />
                )}
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className={`absolute inset-0 rounded-3xl p-5 md:p-8 flex flex-col justify-center items-center backface-hidden border`}
                 style={{ 
                    background: cardMaterialBg, 
                    borderColor: isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                    boxShadow: typeof glowShadow !== 'undefined' ? glowShadow : 'none',
                    transform: 'translateZ(-9px) rotateY(180deg)'
                 }}>
              
              {!isAutoSpinning && (
                <button onClick={toggleFlip} className={`absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur transition-colors ${isDarkText ? 'text-gray-900' : 'text-white'}`}>
                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 rounded-3xl pointer-events-none`}></div>
              <p className={`text-sm md:text-lg text-center leading-relaxed max-w-[90%] md:max-w-[85%] relative z-10 font-medium ${isDarkText ? 'text-gray-900' : 'text-white'}`}>
                {card.back_details || "No back details provided."}
              </p>
            </div>
            
          </div>
        </div>

        {/* Floating Actions at Bottom */}
        <div className="absolute bottom-16 md:bottom-20 inset-x-0 px-4 flex flex-wrap items-center justify-center gap-3 md:gap-4 z-30 pointer-events-none">
          
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pointer-events-auto">
            {card.resume_url && (
              <a href={card.resume_url} target="_blank" rel="noopener noreferrer" className="px-5 py-3 md:px-6 md:py-4 bg-white text-gray-900 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-base">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l4-5h-3V4h-2v7H8l4 5zM20 18H4v-2H2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2h-2v2z"/></svg>
                Resume
              </a>
            )}
            
            {customLinks.map((link, idx) => link.title && link.url ? (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className={`px-5 py-3 md:px-6 md:py-4 backdrop-blur-xl border rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl text-xs md:text-base max-w-[200px] md:max-w-[250px] truncate flex-shrink-0 ${isDarkText ? 'bg-black/5 text-gray-900 border-black/10 hover:bg-black/10' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>
                {link.title}
              </a>
            ) : null)}
          </div>
          
          <div className="w-px h-6 md:h-8 bg-white/20 hidden md:block mx-2"></div>
          
          <div className="pointer-events-auto">
            <button onClick={handleSaveContact} className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-extrabold shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 text-xs md:text-base">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Save to Contacts
            </button>
          </div>
        </div>
        
        {/* Powered By SnapLink */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center z-20 pointer-events-auto">
          <a href="https://www.snaplinks.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[10px] md:text-xs text-white font-medium uppercase tracking-widest">Powered by</span>
            <span className="text-[10px] md:text-xs text-white font-black tracking-tight">SnapLink</span>
          </a>
        </div>
      </div>

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
          animation: spin3d 10s linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
