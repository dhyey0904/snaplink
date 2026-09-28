'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const EASTER_EGGS = {
  SNAP: 'snap',
  COFFEE: 'coffee',
  MATRIX: 'matrix',
  PARTY: 'party',
  NOT_FOUND: '404',
  UNICORN: 'unicorn',
  DEVELOPER: 'developer',
};

const TOTAL_EGGS = Object.keys(EASTER_EGGS).length;

export default function EasterEggs() {
  const [keys, setKeys] = useState<string>('');
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [foundEggs, setFoundEggs] = useState<Set<string>>(new Set());
  const [showVictory, setShowVictory] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeModeRef = useRef<string | null>(null);

  // Load from storage
  useEffect(() => {
    const stored = localStorage.getItem('snaplinks_easter_eggs');
    if (stored) {
      try {
        setFoundEggs(new Set(JSON.parse(stored)));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (activeModeRef.current) return; // Don't trigger while one is active

      setKeys((prev) => {
        const newKeys = (prev + e.key.toLowerCase()).slice(-20);
        
        // Check for matches
        if (newKeys.endsWith(EASTER_EGGS.SNAP)) triggerEgg('snap', 5000, '🎉 You found a hidden Easter Egg!');
        else if (newKeys.endsWith(EASTER_EGGS.COFFEE)) triggerEgg('coffee', 10000, '☕ Coffee Mode Activated');
        else if (newKeys.endsWith(EASTER_EGGS.MATRIX)) triggerEgg('matrix', 15000, '🟢 Matrix Mode Activated');
        else if (newKeys.endsWith(EASTER_EGGS.PARTY)) triggerEgg('party', 8000, '🎊 Party Mode');
        else if (newKeys.endsWith(EASTER_EGGS.NOT_FOUND)) triggerEgg('404', 5000, '');
        else if (newKeys.endsWith(EASTER_EGGS.UNICORN)) triggerEgg('unicorn', 8000, '🦄 Unicorn Mode');
        else if (newKeys.endsWith(EASTER_EGGS.DEVELOPER)) triggerEgg('developer', 8000, '');

        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile Secret Prompt (Long-press on Logo)
  useEffect(() => {
    let pressTimer: NodeJS.Timeout;

    const checkCode = (code: string | null) => {
      if (!code) return;
      const lowerCode = code.toLowerCase().trim();
      if (lowerCode === EASTER_EGGS.SNAP) triggerEgg('snap', 5000, '🎉 You found a hidden Easter Egg!');
      else if (lowerCode === EASTER_EGGS.COFFEE) triggerEgg('coffee', 10000, '☕ Coffee Mode Activated');
      else if (lowerCode === EASTER_EGGS.MATRIX) triggerEgg('matrix', 15000, '🟢 Matrix Mode Activated');
      else if (lowerCode === EASTER_EGGS.PARTY) triggerEgg('party', 8000, '🎊 Party Mode');
      else if (lowerCode === EASTER_EGGS.NOT_FOUND) triggerEgg('404', 5000, '');
      else if (lowerCode === EASTER_EGGS.UNICORN) triggerEgg('unicorn', 8000, '🦄 Unicorn Mode');
      else if (lowerCode === EASTER_EGGS.DEVELOPER) triggerEgg('developer', 8000, '');
    };

    const handleStart = (e: TouchEvent | MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[id^="snaplinks-logo"]') !== null) {
        pressTimer = setTimeout(() => {
          const code = window.prompt("Enter Secret Code (Easter Egg):");
          checkCode(code);
        }, 1200); // 1.2 second long press
      }
    };

    const handleEnd = () => {
      if (pressTimer) clearTimeout(pressTimer);
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[id^="snaplinks-logo"]') !== null) {
        e.preventDefault(); // Prevent "Save Image" popup so prompt can show
      }
    };

    window.addEventListener('touchstart', handleStart);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('mousedown', handleStart);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);


  const triggerEgg = (mode: string, duration: number, toast: string) => {
    setActiveMode(mode);
    activeModeRef.current = mode;
    if (toast) setToastMsg(toast);
    
    // Confetti logic for specific modes
    if (mode === 'snap' || mode === 'party') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }

    // Save progress
    setFoundEggs((prev) => {
      const newSet = new Set(prev);
      if (!newSet.has(mode)) {
        newSet.add(mode);
        localStorage.setItem('snaplinks_easter_eggs', JSON.stringify(Array.from(newSet)));
        if (newSet.size === TOTAL_EGGS) {
          setTimeout(() => setShowVictory(true), duration + 500);
        }
      }
      return newSet;
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveMode(null);
      activeModeRef.current = null;
      setToastMsg(null);
      setKeys(''); // reset keys so they don't immediately re-trigger
    }, duration);
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Injectors per mode */}
      {activeMode === 'snap' && (
        <style>{`
          img[alt="SnapLinks Logo"] {
            animation: snapSpin 1s ease-in-out infinite alternate;
          }
          @keyframes snapSpin {
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.2) rotate(360deg); }
          }
        `}</style>
      )}

      {activeMode === 'coffee' && (
        <style>{`
          html, body {
            background-color: #f3e5d8 !important;
            color: #4e342e !important;
          }
          * {
            border-color: #d7ccc8 !important;
          }
          .bg-white, .bg-gray-50, .bg-slate-50, .bg-blue-50 {
            background-color: #efebe9 !important;
          }
          .text-gray-900, .text-gray-800 {
            color: #3e2723 !important;
          }
          .text-gray-500, .text-gray-600 {
            color: #5d4037 !important;
          }
          button, a.bg-blue-600, .bg-\[\#1a73e8\] {
            background-color: #6d4c41 !important;
            color: #fff !important;
          }
          body {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><text y='20' font-size='20'>☕</text></svg>"), auto !important;
          }
        `}</style>
      )}

      {activeMode === 'matrix' && (
        <div className="fixed inset-0 z-[9998] bg-black text-[#0f0] font-mono p-10 pointer-events-none opacity-90 overflow-hidden">
          <style>{`
            body { overflow: hidden; }
            @keyframes scanline {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100vh); }
            }
            .matrix-scan {
              position: absolute; top: 0; left: 0; right: 0; height: 10px;
              background: rgba(0, 255, 0, 0.3);
              animation: scanline 3s linear infinite;
              box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            }
          `}</style>
          <div className="matrix-scan"></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 1 }}
          >
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mb-4">Access Granted...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="mb-4">Welcome, Neo.</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }} className="mb-4">Initializing SnapLinks...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7 }} className="mb-4">Done.</motion.p>
          </motion.div>
        </div>
      )}

      {activeMode === 'party' && (
        <style>{`
          html, body {
            animation: rainbowBg 3s infinite alternate !important;
          }
          @keyframes rainbowBg {
            0% { background-color: #ff9a9e; }
            50% { background-color: #fecfef; }
            100% { background-color: #a1c4fd; }
          }
          img[alt="SnapLinks Logo"] {
            animation: bounce 0.5s infinite alternate !important;
          }
          button, a {
            animation: pulse 1s infinite alternate !important;
          }
        `}</style>
      )}

      {activeMode === '404' && (
        <>
          <style>{`
            button, a, .bg-white {
              animation: shake 0.5s infinite alternate !important;
            }
            @keyframes shake {
              0% { transform: translate(1px, 1px) rotate(0deg); }
              20% { transform: translate(-3px, 0px) rotate(1deg); }
              40% { transform: translate(1px, -1px) rotate(1deg); }
              60% { transform: translate(-3px, 1px) rotate(0deg); }
              80% { transform: translate(-1px, -1px) rotate(1deg); }
              100% { transform: translate(1px, -2px) rotate(-1deg); }
            }
          `}</style>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center border-4 border-red-500 scale-150 rotate-6">
              <h1 className="text-6xl font-black text-red-500 mb-4">404</h1>
              <p className="text-2xl font-bold mb-4">Oops...</p>
              <p className="text-xl text-gray-500">Just kidding 😄</p>
            </div>
          </div>
        </>
      )}

      {activeMode === 'unicorn' && (
        <style>{`
          html, body {
            background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
            background-size: 1800% 1800%;
            animation: rainbow 5s ease infinite !important;
          }
          @keyframes rainbow { 
            0%{background-position:0% 82%}
            50%{background-position:100% 19%}
            100%{background-position:0% 82%}
          }
          img[alt="SnapLinks Logo"], h1, h2 {
            filter: drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px #ff00ff) !important;
          }
          body {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><text y='20' font-size='20'>🦄</text></svg>"), auto !important;
          }
        `}</style>
      )}

      {activeMode === 'developer' && (
        <div className="fixed inset-0 z-[9998] bg-[#1e1e1e] text-[#d4d4d4] font-mono flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#252526] rounded-xl overflow-hidden shadow-2xl border border-[#333]">
            <div className="bg-[#323233] px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <span className="ml-4 text-xs">bash - SnapLinks Terminal</span>
            </div>
            <div className="p-6 text-sm md:text-base">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 1 }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-2 text-[#569cd6]">$ npm run build</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mb-2">Compiling...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }} className="mb-2">Running tests...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }} className="mb-2 text-[#4ec9b0]">✓ 0 Errors</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }} className="mb-6 text-[#ce9178]">Deployment Successful</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, scale: 1.1, originX: 0 }} transition={{ delay: 7 }} className="font-bold text-xl text-[#dcdcaa]">Welcome Developer 🚀</motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      <AnimatePresence>
        {showVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-10 max-w-md text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="text-6xl mb-6">🏆</div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Congratulations!</h2>
              <p className="text-gray-600 mb-6 text-lg">
                You found every hidden SnapLinks Easter Egg.
                <br /><br />
                You're officially a <strong>SnapLinks Explorer</strong>.
              </p>
              <button
                onClick={() => setShowVictory(false)}
                className="w-full bg-[#1a73e8] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Claim Badge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
