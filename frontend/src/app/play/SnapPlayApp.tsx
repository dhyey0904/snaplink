'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import Link from 'next/link';

// --- GAMES ---
const GAMES = [
  { id: 'reflex', name: 'Reflex Rush', desc: 'Tap the targets as fast as possible before time runs out!', duration: 15 },
  { id: 'precision', name: 'Precision Click', desc: 'Hit the tiny moving circles!', duration: 20 },
  { id: 'memory', name: 'Memory Match', desc: 'Remember the pattern!', duration: 30 },
];

function getDailyGame() {
  const dateStr = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) hash = Math.imul(31, hash) + dateStr.charCodeAt(i) | 0;
  
  // Pick game deterministically
  const gameIndex = Math.abs(hash) % GAMES.length;
  return { ...GAMES[gameIndex], seed: hash };
}

export default function SnapPlayApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [dailyGame, setDailyGame] = useState<any>(null);
  
  // Stats
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Game 1: Reflex Rush state
  const [targetPos, setTargetPos] = useState({ top: 50, left: 50 });
  const [reactionTotal, setReactionTotal] = useState(0);
  const [hits, setHits] = useState(0);
  const lastTargetTime = useRef(0);
  const timerRef = useRef<any>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setDailyGame(getDailyGame());
    
    // Load streak
    const s = localStorage.getItem('snapplay_streak');
    if (s) setStreak(parseInt(s));
  }, []);

  if (!isMounted || !dailyGame) return null;

  const startGame = () => {
    setScore(0);
    setHits(0);
    setReactionTotal(0);
    setTimeLeft(dailyGame.duration);
    setGameState('playing');
    lastTargetTime.current = Date.now();
    moveTarget();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveTarget = () => {
    setTargetPos({
      top: 15 + Math.random() * 70,
      left: 15 + Math.random() * 70
    });
    lastTargetTime.current = Date.now();
  };

  const hitTarget = () => {
    const reaction = Date.now() - lastTargetTime.current;
    setReactionTotal(prev => prev + reaction);
    setHits(prev => prev + 1);
    
    // Calculate points (faster = more points)
    let points = 100;
    if (reaction < 300) points = 500;
    else if (reaction < 500) points = 300;
    
    setScore(prev => prev + points);
    moveTarget();
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    setGameState('result');
    
    // Update streak if first win today (simplified for prototype)
    const todayStr = new Date().toISOString().split('T')[0];
    const lastPlayed = localStorage.getItem('snapplay_last');
    if (lastPlayed !== todayStr) {
      setStreak(prev => {
        const newStreak = prev + 1;
        localStorage.setItem('snapplay_streak', newStreak.toString());
        return newStreak;
      });
      localStorage.setItem('snapplay_last', todayStr);
    }

    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `snapplay-score.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full relative z-10 pt-4 pb-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <Link href="/" className="text-white/50 hover:text-white transition-colors">&larr; Home</Link>
        <div className="font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          SnapPlay
        </div>
        <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30">
          🔥 {streak}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* MENU */}
        {gameState === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-white/50 mb-8">
              Daily Challenge
            </div>
            
            <h1 className="text-5xl font-black mb-4 tracking-tighter">{dailyGame.name}</h1>
            <p className="text-gray-400 mb-12 text-lg">{dailyGame.desc}</p>
            
            <div className="flex gap-6 mb-12">
              <div className="text-center">
                <span className="block text-2xl font-black text-white">{dailyGame.duration}s</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Time</span>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="text-center">
                <span className="block text-2xl font-black text-white">Global</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Leaderboard</span>
              </div>
            </div>

            <button 
              onClick={startGame}
              className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Play Challenge
            </button>
          </motion.div>
        )}

        {/* PLAYING */}
        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 relative w-full h-full flex flex-col bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md"
          >
            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
              <div className="text-2xl font-black">{score}</div>
              <div className={`text-2xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Game Area (Reflex Rush implementation) */}
            <div className="flex-1 relative cursor-crosshair">
              {dailyGame.id === 'reflex' ? (
                <button
                  onPointerDown={hitTarget}
                  className="absolute w-16 h-16 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-4 border-white active:bg-white transition-colors"
                  style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%`, transform: 'translate(-50%, -50%)' }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-gray-500">
                  <p>(Prototype: Reflex Rush is playable today. Check back tomorrow for other games!)</p>
                  <button
                  onPointerDown={hitTarget}
                  className="absolute w-16 h-16 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-4 border-white active:bg-white transition-colors"
                  style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%`, transform: 'translate(-50%, -50%)' }}
                />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {/* Shareable Card */}
            <div 
              ref={cardRef}
              className="w-[320px] h-[568px] shrink-0 mx-auto rounded-[2rem] bg-[#0a0a0a] shadow-2xl relative overflow-hidden border border-white/20 flex flex-col justify-between p-6"
            >
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[60px]"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[60px]"></div>
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-xl">🎮</span>
                  <span className="text-[10px] font-black tracking-widest uppercase">SnapPlay</span>
                </div>
                
                <div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Daily Challenge</div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{dailyGame.name}</h2>
                </div>
                
                <div className="my-auto text-center py-8">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-2">Final Score</div>
                  <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">{score}</div>
                </div>
                
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50 uppercase font-bold tracking-wider">Avg Reaction</span>
                    <span className="text-white font-mono">{hits > 0 ? (reactionTotal / hits / 1000).toFixed(2) : '0.00'}s</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50 uppercase font-bold tracking-wider">World Rank</span>
                    <span className="text-white font-mono">#{Math.floor(Math.random() * 500) + 1}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50 uppercase font-bold tracking-wider">Streak</span>
                    <span className="text-orange-400 font-bold font-mono">🔥 {streak} Days</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-end">
                  <div className="text-xs font-bold">Can you beat me?</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">snaplinks.in</div>
                </div>
              </div>
            </div>

            <div className="w-full flex gap-3 mt-6">
              <button 
                onClick={downloadCard}
                className="flex-1 py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Share to Story
              </button>
            </div>
            <button 
              onClick={() => setGameState('menu')}
              className="mt-4 text-white/50 text-sm font-medium hover:text-white transition-colors"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
