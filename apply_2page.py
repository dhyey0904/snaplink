import os

content = """'use client';

import { useState, useEffect, useRef } from 'react';
import { Book } from '@/utils/books';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function BookReaderClient({ book }: { book: Book }) {
  // Opening animation state
  const [isOpening, setIsOpening] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  
  // Reader state
  const [currentPage, setCurrentPage] = useState(0); // For 2-page, this is always an EVEN number (0, 2, 4)
  const [theme, setTheme] = useState<'light'|'dark'|'sepia'>('light');
  const [fontSize, setFontSize] = useState<'normal'|'large'|'xl'>('normal');
  const [fontFamily, setFontFamily] = useState<'serif'|'sans'|'dyslexic'>('serif');
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [turnDirection, setTurnDirection] = useState(1);
  
  // TTS State
  const [isReading, setIsReading] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState<'none'|'rain'|'forest'>('none');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Flatten pages for easy navigation
  const allPages = book.chapters.flatMap((c, cIdx) => 
    c.pages.map((p, pIdx) => ({
      ...p,
      chapterTitle: c.title,
      globalIndex: 0
    }))
  ).map((p, i) => ({ ...p, globalIndex: i }));

  const totalPages = allPages.length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`snapbook_progress_${book.slug}`);
    if (saved) {
      let savedPage = parseInt(saved, 10);
      if (!isMobile && savedPage % 2 !== 0) savedPage -= 1; // Align to left page on desktop
      setCurrentPage(savedPage);
    }
  }, [book.slug, isMobile]);

  useEffect(() => {
    if (hasOpened) {
      localStorage.setItem(`snapbook_progress_${book.slug}`, currentPage.toString());
    }
  }, [currentPage, hasOpened, book.slug]);

  // Ambient Audio
  useEffect(() => {
    if (ambientAudio !== 'none' && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio blocked', e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [ambientAudio]);

  const handleNextPage = () => {
    const step = isMobile ? 1 : 2;
    if (currentPage + step < totalPages) {
      setTurnDirection(1);
      setCurrentPage(prev => prev + step);
    }
  };

  const handlePrevPage = () => {
    const step = isMobile ? 1 : 2;
    if (currentPage > 0) {
      setTurnDirection(-1);
      setCurrentPage(prev => Math.max(0, prev - step));
    }
  };

  const getThemeClasses = () => {
    if (theme === 'dark') return 'bg-[#111] text-gray-300';
    if (theme === 'sepia') return 'bg-[#f4ecd8] text-[#5b4636]';
    return 'bg-[#fcfcfc] text-gray-900';
  };
  
  const getPageThemeClasses = () => {
    if (theme === 'dark') return 'bg-[#1a1a1a] shadow-black/50 border-gray-800';
    if (theme === 'sepia') return 'bg-[#f4ebd8] shadow-amber-900/10 border-amber-900/10';
    return 'bg-white shadow-gray-200/50 border-gray-100';
  };

  const getFontClasses = () => {
    const family = fontFamily === 'sans' ? 'font-sans' : fontFamily === 'dyslexic' ? 'font-mono' : 'font-serif';
    const size = fontSize === 'xl' ? 'text-2xl leading-relaxed' : fontSize === 'large' ? 'text-xl leading-relaxed' : 'text-lg leading-loose';
    return `${family} ${size}`;
  };

  if (!hasOpened) {
    return (
      <div className="fixed inset-0 bg-[#f5f5f7] flex items-center justify-center z-50 overflow-hidden">
        <Link href="/snapbook" className="absolute top-8 left-8 text-gray-500 hover:text-gray-900 transition-colors z-50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <AnimatePresence>
          {!isOpening && (
            <motion.div 
              initial={{ scale: 0.9, y: 50, rotateX: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative cursor-pointer perspective-1000 group"
              onClick={() => setIsOpening(true)}
            >
              <div 
                className="w-[300px] md:w-[400px] aspect-[1/1.5] rounded-r-2xl rounded-l-md relative transform-style-3d transition-transform duration-700 ease-out group-hover:rotate-y-12 shadow-2xl group-hover:shadow-3xl"
                style={{ backgroundColor: book.coverColor }}
              >
                <div className="absolute left-0 inset-y-0 w-4 bg-black/20 rounded-l-md z-20 mix-blend-overlay shadow-inner"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-20 pointer-events-none"></div>
                <img src={book.coverImage} className="absolute inset-0 w-full h-full object-cover rounded-r-2xl rounded-l-md opacity-90 mix-blend-multiply" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-20 text-white drop-shadow-md">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">{book.category}</p>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">{book.title}</h1>
                    {book.subtitle && <p className="text-lg font-medium opacity-90 mt-4 italic">{book.subtitle}</p>}
                  </div>
                  <p className="text-sm font-medium uppercase tracking-widest opacity-80">{book.author}</p>
                </div>
              </div>
              <div className="absolute -bottom-12 inset-x-0 text-center text-gray-400 font-medium tracking-widest text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Click to Open
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isOpening && (
          <motion.div 
            initial={{ backgroundColor: 'transparent' }}
            animate={{ backgroundColor: '#000' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onAnimationComplete={() => setTimeout(() => setHasOpened(true), 500)}
          >
            <motion.div
              initial={{ scale: 1, rotateY: 12, rotateZ: 0 }}
              animate={{ scale: 2, rotateY: -90, rotateZ: 0, x: '-50%', opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.64, 0, 0.78, 0] }}
              className="w-[300px] md:w-[400px] aspect-[1/1.5] rounded-r-2xl rounded-l-md relative transform-style-3d shadow-2xl"
              style={{ backgroundColor: book.coverColor, transformOrigin: 'left center' }}
            >
              <div className="absolute left-0 inset-y-0 w-4 bg-black/20 rounded-l-md z-20 mix-blend-overlay"></div>
              <img src={book.coverImage} className="absolute inset-0 w-full h-full object-cover rounded-r-2xl rounded-l-md opacity-90 mix-blend-multiply" />
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  // Calculate pages to show
  const leftPage = allPages[currentPage];
  const rightPage = !isMobile && currentPage + 1 < totalPages ? allPages[currentPage + 1] : null;

  const PageContent = ({ page, side }: { page: any, side: 'left' | 'right' }) => (
    <div className="h-full flex flex-col relative z-20">
      <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-8 text-center">{page.chapterTitle}</div>
      <div className={`flex-1 overflow-y-auto hide-scrollbar ${getFontClasses()}`}>
        {page.type === 'text' ? (
          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose pb-12 px-2" dangerouslySetInnerHTML={{ 
            __html: page.content.replace(/# (.*)/g, '<h1 class="text-3xl font-serif font-bold mb-6">$1</h1>').replace(/## (.*)/g, '<h2 class="text-2xl font-serif font-bold mb-4 mt-8">$1</h2>').replace(new RegExp('\\\\n\\\\n', 'g'), '<br/><br/>') 
          }} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center px-4 pb-12">
            <img src={page.content} alt={page.caption} className="max-h-[60vh] object-contain rounded-lg shadow-lg" />
            {page.caption && <p className="text-sm italic opacity-60 mt-6 text-center">{page.caption}</p>}
          </div>
        )}
      </div>
      <div className={`mt-6 text-xs font-bold opacity-30 ${side === 'left' ? 'text-left pl-4' : 'text-right pr-4'}`}>
        {page.globalIndex + 1}
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-500 ${getThemeClasses()}`}>
      
      {ambientAudio !== 'none' && (
        <audio ref={audioRef} loop src={ambientAudio === 'rain' ? 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c6bb1c25.mp3' : 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_2267ff4693.mp3'} />
      )}

      {/* Top UI */}
      <header className="h-16 flex items-center justify-between px-6 z-40 bg-black/5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/snapbook" className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <button onClick={() => setShowToc(!showToc)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
          <span className="hidden md:block text-sm font-medium opacity-60 uppercase tracking-widest">{book.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsReading(!isReading)} className={`p-2 rounded-full transition-colors ${isReading ? 'bg-[#1a4b3c] text-white' : 'hover:bg-black/10'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 19h4.5a2 2 0 001.414-.586l4-4A2 2 0 0016 13V11a2 2 0 00-.586-1.414l-4-4A2 2 0 0010.5 5H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </header>

      {/* Main Reader Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden py-8 px-4 md:px-12">
        
        {/* Navigation Overlays */}
        <button onClick={handlePrevPage} disabled={currentPage === 0} className="absolute left-0 inset-y-0 w-1/6 z-30 cursor-pointer disabled:cursor-not-allowed group flex items-center pl-8">
          <div className="w-12 h-12 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </div>
        </button>
        <button onClick={handleNextPage} disabled={isMobile ? currentPage === totalPages - 1 : currentPage + 2 >= totalPages} className="absolute right-0 inset-y-0 w-1/6 z-30 cursor-pointer disabled:cursor-not-allowed group flex items-center justify-end pr-8">
          <div className="w-12 h-12 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </button>

        {/* The Book Container */}
        <div className="w-full h-full max-w-6xl max-h-[90vh] bg-transparent flex relative perspective-2000 mx-auto">
          
          {/* Real Book Spine Background */}
          <div className={`absolute inset-0 rounded-sm shadow-2xl ${getPageThemeClasses()} border`}>
            {/* Hardcover edges illusion */}
            <div className={`absolute -inset-1 -z-10 rounded-md ${theme === 'dark' ? 'bg-[#111]' : 'bg-[#e2e0db]'} shadow-[0_15px_35px_rgba(0,0,0,0.2)]`}></div>
          </div>

          {/* Book Crease */}
          <div className="hidden md:block absolute left-1/2 inset-y-0 w-12 -ml-6 z-10 pointer-events-none" 
               style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0) 100%)' }}>
          </div>

          <AnimatePresence mode="popLayout" initial={false} custom={turnDirection}>
            <motion.div 
              key={currentPage}
              custom={turnDirection}
              initial={{ rotateY: turnDirection > 0 ? 30 : -30, opacity: 0, scale: 0.95 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: turnDirection > 0 ? -30 : 30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="flex w-full h-full relative z-20 origin-center"
            >
              
              {/* Left Page (or single page on mobile) */}
              <div className="w-full md:w-1/2 h-full flex flex-col relative px-8 py-10 md:px-14 md:py-12 border-r border-black/5" style={{ perspective: '1000px' }}>
                <PageContent page={leftPage} side="left" />
                {/* Subtle paper gradient */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent to-black/[0.03]"></div>
              </div>

              {/* Right Page (Desktop only) */}
              <div className="hidden md:flex w-1/2 h-full flex-col relative px-8 py-10 md:px-14 md:py-12">
                {rightPage ? (
                  <PageContent page={rightPage} side="right" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center opacity-30">
                    <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                )}
                {/* Subtle paper gradient */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent to-black/[0.03]"></div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 right-6 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 z-50 text-gray-900 dark:text-white"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Reading Settings</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Theme</p>
                <div className="flex gap-2">
                  <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-lg border ${theme === 'light' ? 'border-[#1a4b3c] bg-[#1a4b3c]/5' : 'border-gray-200'} bg-white text-gray-900`}>Aa</button>
                  <button onClick={() => setTheme('sepia')} className={`flex-1 py-2 rounded-lg border ${theme === 'sepia' ? 'border-amber-700 bg-amber-700/5' : 'border-amber-200'} bg-[#f4ecd8] text-[#5b4636]`}>Aa</button>
                  <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-500 bg-gray-700' : 'border-gray-800'} bg-[#111] text-gray-300`}>Aa</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Font</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <button onClick={() => setFontFamily('serif')} className={`py-2 rounded-lg font-serif ${fontFamily === 'serif' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5'}`}>Serif</button>
                  <button onClick={() => setFontFamily('sans')} className={`py-2 rounded-lg font-sans ${fontFamily === 'sans' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5'}`}>Modern</button>
                  <button onClick={() => setFontFamily('dyslexic')} className={`py-2 rounded-lg font-mono text-xs ${fontFamily === 'dyslexic' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5'}`}>Dyslexic</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { width: 6px; }
        .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hide-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.15); border-radius: 10px; }
        .dark .hide-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
"""

with open(r'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
