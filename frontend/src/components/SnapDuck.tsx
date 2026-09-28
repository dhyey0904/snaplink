'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

// --- CONFIG ---
const ALLOWED_PAGES = ['/', '/tools', '/pricing', '/about', '/file-sharing', '/login', '/register', '/dashboard'];

const DUCK_TYPES = [
  { id: 'classic', name: 'Classic Duck', emoji: '🦆', rarity: 'Normal', weight: 800, color: 'from-yellow-400 to-orange-500' },
  { id: 'coffee', name: 'Coffee Duck', emoji: '☕', rarity: 'Normal', weight: 600, color: 'from-amber-700 to-amber-900' },
  { id: 'ghost', name: 'Ghost Duck', emoji: '👻', rarity: 'Rare', weight: 150, color: 'from-gray-200 to-gray-400' },
  { id: 'space', name: 'Space Duck', emoji: '🚀', rarity: 'Rare', weight: 150, color: 'from-indigo-900 to-purple-900' },
  { id: 'crystal', name: 'Crystal Duck', emoji: '💎', rarity: 'Epic', weight: 40, color: 'from-cyan-300 to-blue-500' },
  { id: 'matrix', name: 'Matrix Duck', emoji: '🟩', rarity: 'Epic', weight: 40, color: 'from-green-400 to-green-700' },
  { id: 'legendary', name: 'Crown Duck', emoji: '👑', rarity: 'Legendary', weight: 10, color: 'from-purple-500 to-pink-600' },
  { id: 'golden', name: 'Golden Duck', emoji: '🏆', rarity: 'Golden', weight: 2, color: 'from-yellow-300 via-yellow-500 to-yellow-600' },
];

// --- SEEDED RNG ---
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function getDailyData(dateStr: string) {
  // Hash date string to number
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = Math.imul(31, hash) + dateStr.charCodeAt(i) | 0;
  }
  const random = mulberry32(hash);

  // Pick Page
  const pageIndex = Math.floor(random() * ALLOWED_PAGES.length);
  const targetPage = ALLOWED_PAGES[pageIndex];

  // Pick Duck Type based on weights
  const totalWeight = DUCK_TYPES.reduce((acc, curr) => acc + curr.weight, 0);
  let r = random() * totalWeight;
  let selectedDuck = DUCK_TYPES[0];
  for (const duck of DUCK_TYPES) {
    if (r < duck.weight) {
      selectedDuck = duck;
      break;
    }
    r -= duck.weight;
  }

  // Pick Position (10% to 90% to avoid edges)
  const top = 10 + (random() * 80);
  const left = 10 + (random() * 80);

  return { targetPage, selectedDuck, top, left };
}

export default function SnapDuck() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [dailyData, setDailyData] = useState<any>(null);
  const [hasFoundToday, setHasFoundToday] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  useEffect(() => {
    setIsMounted(true);
    const data = getDailyData(todayStr);
    setDailyData(data);

    // Check if found today
    const storage = localStorage.getItem('snapduck_collection');
    if (storage) {
      try {
        const collection = JSON.parse(storage);
        if (collection.some((d: any) => d.date === todayStr)) {
          setHasFoundToday(true);
        }
      } catch(e) {}
    }
  }, [todayStr]);

  if (!isMounted || !dailyData) return null;

  // Only render duck if on the correct page and hasn't found it yet
  const isCorrectPage = pathname === dailyData.targetPage;
  const shouldShowDuck = isCorrectPage && !hasFoundToday && !showModal;

  const handleFindDuck = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowModal(true);
    setHasFoundToday(true);

    // Save to collection
    const storage = localStorage.getItem('snapduck_collection') || '[]';
    try {
      const collection = JSON.parse(storage);
      if (!collection.some((d: any) => d.date === todayStr)) {
        collection.push({
          date: todayStr,
          duckId: dailyData.selectedDuck.id
        });
        localStorage.setItem('snapduck_collection', JSON.stringify(collection));
      }
    } catch(e) {}
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `snapduck-${dailyData.selectedDuck.id}-${todayStr}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export', err);
    }
  };

  return (
    <>
      {/* The Hidden Duck */}
      <AnimatePresence>
        {shouldShowDuck && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            onClick={handleFindDuck}
            className="fixed z-[40] text-3xl md:text-4xl hover:scale-125 transition-transform cursor-pointer filter drop-shadow-lg group"
            style={{ top: `${dailyData.top}%`, left: `${dailyData.left}%` }}
          >
            <div className="relative">
              {dailyData.selectedDuck.emoji}
              <div className="absolute -top-6 -right-6 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Quack!
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Discovery Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              
              {/* Share Card */}
              <div 
                ref={cardRef}
                className="w-full aspect-[9/16] max-h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col items-center justify-center p-8 text-white text-center bg-[#0a0a0a]"
              >
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${dailyData.selectedDuck.color}`}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay opacity-30"></div>
                
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
                  <div>
                    <h4 className="text-[10px] tracking-widest font-black uppercase text-white/50 mb-1">SnapDuck Hunt</h4>
                    <p className="text-sm font-bold text-white/90">Daily Discovery</p>
                  </div>
                  
                  <div className="flex flex-col items-center my-auto">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12, delay: 0.2 }}
                      className="text-8xl mb-6 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                      {dailyData.selectedDuck.emoji}
                    </motion.div>
                    
                    <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">{dailyData.selectedDuck.name}</h2>
                    <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
                      Rarity: {dailyData.selectedDuck.rarity}
                    </div>
                    
                    <p className="text-xs text-white/60 mb-1">Found on</p>
                    <p className="text-sm font-bold">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>

                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">
                    snaplinks.in
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full gap-3 mt-6">
                <button 
                  onClick={downloadCard}
                  className="flex-1 py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Share Card
                </button>
                <Link href="/ducks"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all text-center"
                >
                  My Collection
                </Link>
              </div>
              
              <button 
                onClick={() => setShowModal(false)}
                className="mt-6 text-white/50 hover:text-white transition-colors text-sm"
              >
                Close & Continue Browsing
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
