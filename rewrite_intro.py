import os

content = """'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { Book } from '@/utils/books';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
const FlipBook = HTMLFlipBook as any;

// --- Sub-Components ---

// Inside Pages
const Page = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div className={`page bg-transparent relative h-full w-full`} ref={ref} data-density={props.density || 'soft'}>
      <div className={`w-full h-full flex flex-col relative px-6 py-10 md:px-14 md:py-12 shadow-[0_0_15px_rgba(0,0,0,0.1)] ${props.themeClasses}`}>
        {/* Subtle paper gradient based on side */}
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent to-black/[0.04] ${props.side === 'right' ? 'bg-gradient-to-l' : ''}`}></div>
        
        {/* Book spine crease shadow */}
        <div className={`absolute top-0 bottom-0 w-8 pointer-events-none ${props.side === 'right' ? 'left-0 bg-gradient-to-r from-black/10 to-transparent' : 'right-0 bg-gradient-to-l from-black/10 to-transparent'}`}></div>

        <div className="relative z-10 h-full flex flex-col">
           {props.children}
        </div>
      </div>
    </div>
  );
});
Page.displayName = 'Page';

// Hard Cover (Front and Back)
const PageCover = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div className="page page-cover bg-transparent relative h-full w-full" ref={ref} data-density="hard">
      <div className="w-full h-full relative rounded-r-xl shadow-2xl overflow-hidden transform-style-3d" style={{ backgroundColor: props.book.coverColor }}>
         {props.side === 'front' ? (
           <>
              <div className="absolute left-0 inset-y-0 w-6 bg-black/30 rounded-l-md z-20 mix-blend-overlay shadow-inner"></div>
              <img src={props.book.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply" />
              <div className="absolute inset-0 p-10 flex flex-col justify-between z-20 text-white drop-shadow-lg">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">{props.book.category}</p>
                  <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">{props.book.title}</h1>
                  {props.book.subtitle && <p className="text-xl font-medium opacity-90 mt-4 italic">{props.book.subtitle}</p>}
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest opacity-80">{props.book.author}</p>
                  <p className="text-xs opacity-60 mt-1">{props.book.edition}</p>
                </div>
              </div>
           </>
         ) : (
           <>
             {/* Back Cover */}
             <div className="absolute right-0 inset-y-0 w-6 bg-black/30 rounded-r-md z-20 mix-blend-overlay shadow-inner"></div>
             <div className="absolute inset-0 p-10 flex flex-col items-center justify-center z-20 text-white text-center">
                <h2 className="font-serif text-2xl font-bold mb-4 opacity-50">SnapBook</h2>
                <p className="text-sm opacity-60 max-w-xs">{props.book.description}</p>
             </div>
           </>
         )}
      </div>
    </div>
  );
});
PageCover.displayName = 'PageCover';


export default function BookReaderClient({ book }: { book: Book }) {
  // Settings
  const [theme, setTheme] = useState<'light'|'dark'|'sepia'>('light');
  const [fontSize, setFontSize] = useState<'normal'|'large'|'xl'>('normal');
  const [fontFamily, setFontFamily] = useState<'serif'|'sans'|'dyslexic'>('serif');
  const [showSettings, setShowSettings] = useState(false);
  
  // UI Panels
  const [showToc, setShowToc] = useState(false);
  
  // Reader state
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Audio
  const [ambientAudio, setAmbientAudio] = useState<'none'|'rain'|'forest'>('none');
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  // TTS
  const [isReading, setIsReading] = useState(false);
  const [currentSentence, setCurrentSentence] = useState('');
  
  // Introduction Screen
  const [showIntro, setShowIntro] = useState(true);

  // Flatten pages
  const allPages = book.chapters.flatMap((c) => 
    c.pages.map((p) => ({ ...p, chapterTitle: c.title }))
  );
  
  // Pad total pages to be even for the flipbook (so back cover lands on the left side properly)
  if (allPages.length % 2 !== 0) {
    allPages.push({ content: '', type: 'text', chapterTitle: '' });
  }

  const totalPages = allPages.length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (ambientAudio !== 'none' && ambientRef.current) {
      ambientRef.current.play().catch(e => console.log('Audio blocked', e));
    } else if (ambientRef.current) {
      ambientRef.current.pause();
    }
  }, [ambientAudio]);

  useEffect(() => {
    if (isReading) {
      const synth = window.speechSynthesis;
      synth.cancel(); 
      
      const pageIdx = currentPage - 1; // offset because of Cover
      const pageText = allPages[pageIdx]?.content?.replace(/<[^>]+>/g, '').replace(/[#*]/g, '') || '';
      const sentences = pageText.match(/[^.!?]+[.!?]+/g) || [pageText];
      
      let sentenceIndex = 0;
      
      const speakNext = () => {
        if (sentenceIndex < sentences.length && isReading) {
          const text = sentences[sentenceIndex].trim();
          if (!text) {
             sentenceIndex++;
             speakNext();
             return;
          }
          setCurrentSentence(text);
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.onend = () => {
            sentenceIndex++;
            speakNext();
          };
          synth.speak(utterance);
        } else if (sentenceIndex >= sentences.length && isReading) {
          if (bookRef.current) {
             bookRef.current.pageFlip().flipNext();
          }
        }
      };
      
      speakNext();
      return () => synth.cancel();
    } else {
      window.speechSynthesis.cancel();
      setCurrentSentence('');
    }
  }, [isReading, currentPage, allPages]);

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const getThemeClasses = () => {
    if (theme === 'dark') return 'bg-[#111] text-gray-300';
    if (theme === 'sepia') return 'bg-[#f4ecd8] text-[#5b4636]';
    return 'bg-[#f5f5f7] text-gray-900';
  };
  
  const getPageThemeClasses = () => {
    if (theme === 'dark') return 'bg-[#1a1a1a] shadow-black/50 border-gray-800';
    if (theme === 'sepia') return 'bg-[#f4ebd8] shadow-amber-900/10 border-amber-900/10';
    return 'bg-[#fafafa] shadow-gray-200/50 border-gray-100';
  };

  const getFontClasses = () => {
    const family = fontFamily === 'sans' ? 'font-sans' : fontFamily === 'dyslexic' ? 'font-mono' : 'font-serif';
    const size = fontSize === 'xl' ? 'text-2xl leading-relaxed' : fontSize === 'large' ? 'text-xl leading-relaxed' : 'text-lg leading-loose';
    return `${family} ${size}`;
  };

  const renderContent = (content: string) => {
    return content.replace(/# (.*)/g, '<h1 class="text-3xl font-serif font-bold mb-6">$1</h1>')
                  .replace(/## (.*)/g, '<h2 class="text-2xl font-serif font-bold mb-4 mt-8">$1</h2>')
                  .replace(new RegExp('\\\\n\\\\n', 'g'), '<br/><br/>');
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-[#f5f5f7] flex items-center justify-center z-50 overflow-hidden text-gray-900 p-6">
        <Link href="/snapbook" className="absolute top-8 left-8 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-500 hover:text-gray-900 z-50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ scale: 0.9, rotateY: -10, opacity: 0 }}
            animate={{ scale: 1, rotateY: 10, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-[260px] md:w-[350px] aspect-[1/1.5] rounded-r-2xl rounded-l-md shadow-2xl relative perspective-1000 transform-style-3d shrink-0"
            style={{ backgroundColor: book.coverColor }}
          >
             <div className="absolute left-0 inset-y-0 w-4 bg-black/20 rounded-l-md z-20 mix-blend-overlay shadow-inner"></div>
             <img src={book.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply rounded-r-2xl rounded-l-md" />
             <div className="absolute inset-0 p-8 flex flex-col justify-between z-20 text-white drop-shadow-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{book.category}</p>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">{book.title}</h1>
                </div>
                <p className="text-sm font-medium uppercase tracking-widest opacity-80">{book.author}</p>
             </div>
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
             <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#1a4b3c]/10 text-[#1a4b3c] rounded-full text-xs font-bold uppercase tracking-wider">{book.readingTime} Read</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{book.difficulty}</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-bold mb-4">{book.title}</h2>
             <p className="text-lg text-gray-600 mb-8 leading-relaxed">{book.description}</p>
             
             <button 
                onClick={() => setShowIntro(false)}
                className="px-8 py-4 bg-[#1a4b3c] text-white rounded-xl font-bold text-lg hover:bg-[#12362b] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
             >
                Open Book
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-500 overflow-hidden ${getThemeClasses()}`}>
      
      {ambientAudio !== 'none' && (
        <audio ref={ambientRef} loop src={ambientAudio === 'rain' ? 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c6bb1c25.mp3' : 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_2267ff4693.mp3'} />
      )}

      {/* Top Header */}
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 z-40 bg-black/5 backdrop-blur-sm relative border-b border-black/5">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowIntro(true)} className="p-2 rounded-full hover:bg-black/10 transition-colors" title="Close Book">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <button onClick={() => setShowToc(!showToc)} className={`p-2 rounded-full transition-colors ${showToc ? 'bg-[#1a4b3c] text-white' : 'hover:bg-black/10'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
          <span className="hidden md:block text-sm font-medium opacity-60 uppercase tracking-widest">{book.title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* TTS Button */}
          <button onClick={() => setIsReading(!isReading)} className={`p-2 rounded-full transition-colors ${isReading ? 'bg-[#1a4b3c] text-white shadow-lg' : 'hover:bg-black/10'}`} title="Audiobook Mode">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 19h4.5a2 2 0 001.414-.586l4-4A2 2 0 0016 13V11a2 2 0 00-.586-1.414l-4-4A2 2 0 0010.5 5H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </button>
          {/* Settings Button */}
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </header>

      {/* Interactive Main Reader Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden py-10 perspective-2000">
        
        <AnimatePresence>
          {showToc && (
            <motion.div 
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-3xl shadow-[20px_0_40px_rgba(0,0,0,0.1)] z-50 border-r border-black/5 flex flex-col"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold">Contents</h2>
                <button onClick={() => setShowToc(false)} className="opacity-50 hover:opacity-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {book.chapters.map((chap, i) => {
                  const targetPage = allPages.findIndex(p => p.chapterTitle === chap.title) + 1; // +1 because Cover is page 0
                  return (
                    <button 
                      key={chap.title} 
                      onClick={() => {
                        if(bookRef.current) bookRef.current.pageFlip().turnToPage(targetPage);
                        setShowToc(false);
                      }}
                      className="block w-full text-left text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      {i + 1}. {chap.title}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReading && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#1a4b3c] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 max-w-md w-full"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 19h4.5a2 2 0 001.414-.586l4-4A2 2 0 0016 13V11a2 2 0 00-.586-1.414l-4-4A2 2 0 0010.5 5H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-green-200 mb-1">Audiobook Reading</p>
                <p className="text-sm font-medium truncate">{currentSentence || "Starting..."}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real Page Flip Engine Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 mx-auto flex justify-center drop-shadow-2xl"
        >
          <FlipBook 
            width={isMobile ? window.innerWidth - 32 : 450} 
            height={isMobile ? window.innerHeight - 150 : 650} 
            size="stretch"
            minWidth={315}
            maxWidth={600}
            minHeight={420}
            maxHeight={900}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="flip-book shadow-2xl"
            ref={bookRef}
            flippingTime={1000}
            usePortrait={isMobile}
          >
            {/* Front Cover */}
            <PageCover book={book} side="front" />

            {/* Inside Pages */}
            {allPages.map((page, i) => (
              <Page 
                key={i} 
                themeClasses={getPageThemeClasses()}
                side={i % 2 === 0 ? 'right' : 'left'} // Because index 0 is actually page 1 (right side of spread)
              >
                <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-8 text-center">{page.chapterTitle}</div>
                <div className={`flex-1 overflow-y-auto hide-scrollbar ${getFontClasses()}`}>
                  {page.type === 'text' ? (
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose pb-12" dangerouslySetInnerHTML={{ 
                      __html: renderContent(page.content) 
                    }} />
                  ) : page.type === 'image' ? (
                    <div className="h-full flex flex-col items-center justify-center pb-12">
                      <img src={page.content} alt={page.caption} className="max-h-[60vh] object-contain rounded-lg shadow-lg" />
                      {page.caption && <p className="text-sm italic opacity-60 mt-6 text-center">{page.caption}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-30 italic">Blank Page</div>
                  )}
                </div>
                <div className={`mt-6 text-xs font-bold opacity-30 ${i % 2 !== 0 ? 'text-left pl-4' : 'text-right pr-4'}`}>
                  {i + 1}
                </div>
              </Page>
            ))}

            {/* Back Cover */}
            <PageCover book={book} side="back" />
          </FlipBook>
        </motion.div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="h-2 w-full bg-black/5 relative z-40">
        <motion.div 
          className="h-full bg-[#1a4b3c] dark:bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentPage / (totalPages + 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 right-6 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 z-50 text-gray-900 dark:text-white"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Reading Settings</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Theme</p>
                <div className="flex gap-2">
                  <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-lg border ${theme === 'light' ? 'border-[#1a4b3c] bg-[#1a4b3c]/5' : 'border-gray-200'} bg-[#fafafa] text-gray-900`}>Aa</button>
                  <button onClick={() => setTheme('sepia')} className={`flex-1 py-2 rounded-lg border ${theme === 'sepia' ? 'border-amber-700 bg-amber-700/5' : 'border-amber-200'} bg-[#f4ebd8] text-[#5b4636]`}>Aa</button>
                  <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-500 bg-gray-700' : 'border-gray-800'} bg-[#1a1a1a] text-gray-300`}>Aa</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Font Size</p>
                <div className="flex gap-2">
                  <button onClick={() => setFontSize('normal')} className={`flex-1 py-2 rounded-lg border ${fontSize === 'normal' ? 'border-[#1a4b3c] bg-black/5' : 'border-gray-200 dark:border-gray-700'} text-sm`}>A</button>
                  <button onClick={() => setFontSize('large')} className={`flex-1 py-2 rounded-lg border ${fontSize === 'large' ? 'border-[#1a4b3c] bg-black/5' : 'border-gray-200 dark:border-gray-700'} text-lg font-medium`}>A</button>
                  <button onClick={() => setFontSize('xl')} className={`flex-1 py-2 rounded-lg border ${fontSize === 'xl' ? 'border-[#1a4b3c] bg-black/5' : 'border-gray-200 dark:border-gray-700'} text-xl font-bold`}>A</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Font</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <button onClick={() => setFontFamily('serif')} className={`py-2 rounded-lg font-serif border ${fontFamily === 'serif' ? 'border-[#1a4b3c] bg-black/5' : 'border-gray-200 dark:border-gray-700'}`}>Serif</button>
                  <button onClick={() => setFontFamily('sans')} className={`py-2 rounded-lg font-sans border ${fontFamily === 'sans' ? 'border-[#1a4b3c] bg-black/5' : 'border-gray-200 dark:border-gray-700'}`}>Modern</button>
                  <button onClick={() => setFontFamily('dyslexic')} className={`py-2 rounded-lg font-mono text-xs border ${fontFamily === 'dyslexic' ? 'border-[#1a4b3c] bg-black/5' : 'border-gray-200 dark:border-gray-700'}`}>Dyslexic</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Ambient Background</p>
                <div className="flex gap-2">
                  <button onClick={() => setAmbientAudio('none')} className={`flex-1 py-2 rounded-lg border text-xs font-bold ${ambientAudio === 'none' ? 'bg-black/90 text-white' : 'border-gray-200 dark:border-gray-700'}`}>None</button>
                  <button onClick={() => setAmbientAudio('rain')} className={`flex-1 py-2 rounded-lg border text-xs font-bold ${ambientAudio === 'rain' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>Rain</button>
                  <button onClick={() => setAmbientAudio('forest')} className={`flex-1 py-2 rounded-lg border text-xs font-bold ${ambientAudio === 'forest' ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 dark:border-gray-700'}`}>Forest</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { width: 4px; }
        .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hide-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .hide-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); }
        .page { background-color: white; overflow: hidden; }
        .flip-book { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); }
      `}</style>
    </div>
  );
}
"""

with open(r'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
