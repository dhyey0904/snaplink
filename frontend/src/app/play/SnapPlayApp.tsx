'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Link from 'next/link';

const LIBRARY_GAMES = [
  { id: 'math', day: 0, name: 'Speed Math', desc: 'Solve as many simple math equations as you can in 20 seconds!', duration: 20 },
  { id: 'reflex', day: 1, name: 'Reflex Rush', desc: 'Tap the large targets as fast as possible!', duration: 15 },
  { id: 'precision', day: 2, name: 'Precision Click', desc: 'Hit the tiny moving circles!', duration: 15 },
  { id: 'memory', day: 3, name: 'Memory Match', desc: 'Remember the highlighted squares and click them!', duration: 20 },
  { id: 'color', day: 4, name: 'Color Rush', desc: 'Find and click the slightly different colored square.', duration: 15 },
  { id: 'emoji', day: 5, name: 'Find the Odd Emoji', desc: 'Spot the one emoji that doesn\'t belong.', duration: 15 },
  { id: 'number', day: 6, name: 'Number Memory', desc: 'Memorize the number, then type it back.', duration: 20 },
];

function getDailyGame() {
  // Use the date string to generate a daily hash so the sequence is completely random over 365 days
  // This prevents "Mondays always being the same game"
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = Math.imul(31, hash) + dateStr.charCodeAt(i) | 0;
  }
  const gameIndex = Math.abs(hash) % LIBRARY_GAMES.length;
  return LIBRARY_GAMES[gameIndex];
}

export default function SnapPlayApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [dailyGame, setDailyGame] = useState<any>(null);
  
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<any>(null);
  
  // --- GAME SPECIFIC STATES ---
  // Reflex & Precision
  const [targetPos, setTargetPos] = useState({ top: 50, left: 50 });
  const lastTargetTime = useRef(0);
  const [hits, setHits] = useState(0);
  const [reactionTotal, setReactionTotal] = useState(0);

  // Math
  const [mathQ, setMathQ] = useState({ q: '', options: [] as number[], ans: 0 });

  // Grid Games (Color, Emoji, Memory)
  const [gridData, setGridData] = useState<any>(null);
  const [memoryPhase, setMemoryPhase] = useState<'showing' | 'guessing'>('showing');
  const [userSelection, setUserSelection] = useState<number[]>([]);

  // Number
  const [numTarget, setNumTarget] = useState('');
  const [numInput, setNumInput] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setDailyGame(getDailyGame());
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
    
    // Initialize specific game
    if (dailyGame.id === 'reflex' || dailyGame.id === 'precision') {
      moveTarget();
    } else if (dailyGame.id === 'math') {
      generateMath();
    } else if (dailyGame.id === 'color') {
      generateColor();
    } else if (dailyGame.id === 'emoji') {
      generateEmoji();
    } else if (dailyGame.id === 'number') {
      generateNumber(3);
    } else if (dailyGame.id === 'memory') {
      generateMemory(3);
    }

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

  const endGame = () => {
    clearInterval(timerRef.current);
    setGameState('result');
    
    const _d = new Date();
    const todayStr = `${_d.getFullYear()}-${_d.getMonth() + 1}-${_d.getDate()}`;
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

  // --- GAME LOGIC ---

  const moveTarget = () => {
    setTargetPos({ top: 10 + Math.random() * 80, left: 10 + Math.random() * 80 });
    lastTargetTime.current = Date.now();
  };

  const hitTarget = () => {
    const reaction = Date.now() - lastTargetTime.current;
    setReactionTotal(prev => prev + reaction);
    setHits(prev => prev + 1);
    
    let points = 100;
    if (reaction < 400) points = 300;
    if (reaction < 250) points = 500;
    
    setScore(prev => prev + points);
    moveTarget();
  };

  const generateMath = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ans = a + b;
    const ops = [ans, ans + 1, ans - 2].sort(() => Math.random() - 0.5);
    setMathQ({ q: `${a} + ${b} = ?`, options: ops, ans });
    lastTargetTime.current = Date.now();
  };

  const answerMath = (val: number) => {
    if (val === mathQ.ans) {
      const reaction = Date.now() - lastTargetTime.current;
      setReactionTotal(prev => prev + reaction);
      setHits(prev => prev + 1);
      setScore(prev => prev + 300);
      generateMath();
    } else {
      setScore(prev => Math.max(0, prev - 100)); // Penalty
    }
  };

  const generateColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const target = Math.floor(Math.random() * 9);
    setGridData({ hue, target });
    lastTargetTime.current = Date.now();
  };

  const answerGrid = (idx: number, type: string) => {
    if (idx === gridData.target) {
      const reaction = Date.now() - lastTargetTime.current;
      setReactionTotal(prev => prev + reaction);
      setHits(prev => prev + 1);
      setScore(prev => prev + 300);
      if (type === 'color') generateColor();
      if (type === 'emoji') generateEmoji();
    } else {
      setScore(prev => Math.max(0, prev - 100));
    }
  };

  const generateEmoji = () => {
    const pairs = [
      ['🍎', '🍅'], ['😀', '😃'], ['🐶', '🦊'], ['🚗', '🚕'], ['🌟', '⭐']
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const target = Math.floor(Math.random() * 16);
    setGridData({ base: pair[0], odd: pair[1], target });
    lastTargetTime.current = Date.now();
  };

  const generateNumber = (len: number) => {
    let n = '';
    for(let i=0; i<len; i++) n += Math.floor(Math.random() * 10);
    setNumTarget(n);
    setNumInput('');
    setMemoryPhase('showing');
    setTimeout(() => {
      setMemoryPhase('guessing');
      lastTargetTime.current = Date.now();
    }, 1500);
  };

  const submitNumber = () => {
    if (numInput === numTarget) {
      setScore(prev => prev + 500);
      generateNumber(numTarget.length + 1);
    } else {
      setScore(prev => Math.max(0, prev - 200));
      generateNumber(Math.max(3, numTarget.length - 1));
    }
  };

  const generateMemory = (count: number) => {
    const active: number[] = [];
    while (active.length < count) {
      const r = Math.floor(Math.random() * 16);
      if (!active.includes(r)) active.push(r);
    }
    setGridData({ active, count });
    setUserSelection([]);
    setMemoryPhase('showing');
    setTimeout(() => {
      setMemoryPhase('guessing');
      lastTargetTime.current = Date.now();
    }, 1500);
  };

  const answerMemory = (idx: number) => {
    if (memoryPhase !== 'guessing') return;
    if (!gridData.active.includes(idx)) {
      // Wrong
      setScore(prev => Math.max(0, prev - 200));
      generateMemory(Math.max(3, gridData.count - 1));
      return;
    }
    
    if (!userSelection.includes(idx)) {
      const newSel = [...userSelection, idx];
      setUserSelection(newSel);
      if (newSel.length === gridData.count) {
        // Success
        setScore(prev => prev + 500);
        setTimeout(() => generateMemory(gridData.count + 1), 300);
      }
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
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-white/50 mb-8">
              Daily Challenge
            </div>
            
            <h1 className="text-5xl font-black mb-4 tracking-tighter text-white">{dailyGame.name}</h1>
            <p className="text-gray-400 mb-12 text-lg">{dailyGame.desc}</p>
            
            <div className="flex gap-6 mb-12">
              <div className="text-center">
                <span className="block text-2xl font-black text-white">{dailyGame.duration}s</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Time Limit</span>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 relative w-full h-full flex flex-col bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md"
          >
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
              <div className="text-2xl font-black text-white">{score}</div>
              <div className={`text-2xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="flex-1 relative cursor-crosshair flex items-center justify-center p-4 pt-16">
              
              {/* Reflex & Precision */}
              {(dailyGame.id === 'reflex' || dailyGame.id === 'precision') && (
                <button
                  onPointerDown={hitTarget}
                  className={`absolute bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-4 border-white active:bg-white transition-colors ${dailyGame.id === 'precision' ? 'w-8 h-8' : 'w-16 h-16'}`}
                  style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%`, transform: 'translate(-50%, -50%)' }}
                />
              )}

              {/* Speed Math */}
              {dailyGame.id === 'math' && (
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-black mb-12">{mathQ.q}</div>
                  <div className="flex gap-4">
                    {mathQ.options.map((opt, i) => (
                      <button key={i} onClick={() => answerMath(opt)} className="w-20 h-20 bg-white/10 hover:bg-white/20 rounded-2xl text-3xl font-bold transition-colors">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Rush */}
              {dailyGame.id === 'color' && gridData && (
                <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] aspect-square">
                  {Array.from({length: 9}).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => answerGrid(i, 'color')}
                      className="rounded-xl w-full h-full shadow-lg"
                      style={{ 
                        backgroundColor: `hsl(${gridData.hue}, 80%, ${i === gridData.target ? '65%' : '50%'})` 
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Emoji Logic */}
              {dailyGame.id === 'emoji' && gridData && (
                <div className="grid grid-cols-4 gap-2 w-full max-w-[300px] aspect-square">
                  {Array.from({length: 16}).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => answerGrid(i, 'emoji')}
                      className="rounded-xl w-full h-full bg-white/10 flex items-center justify-center text-3xl hover:bg-white/20 transition-colors"
                    >
                      {i === gridData.target ? gridData.odd : gridData.base}
                    </button>
                  ))}
                </div>
              )}

              {/* Number Memory */}
              {dailyGame.id === 'number' && (
                <div className="flex flex-col items-center w-full max-w-[300px]">
                  {memoryPhase === 'showing' ? (
                    <div className="text-6xl font-black tracking-widest">{numTarget}</div>
                  ) : (
                    <>
                      <input 
                        type="number" 
                        autoFocus
                        value={numInput}
                        onChange={(e) => setNumInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitNumber()}
                        className="w-full bg-black/50 text-center text-4xl font-bold py-4 rounded-2xl border-2 border-white/20 text-white outline-none focus:border-blue-500 mb-4"
                      />
                      <button onClick={submitNumber} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">Submit</button>
                    </>
                  )}
                </div>
              )}

              {/* Memory Match */}
              {dailyGame.id === 'memory' && gridData && (
                <div className="grid grid-cols-4 gap-2 w-full max-w-[300px] aspect-square">
                  {Array.from({length: 16}).map((_, i) => {
                    const isActive = gridData.active.includes(i);
                    const isSelected = userSelection.includes(i);
                    const showActive = memoryPhase === 'showing' && isActive;
                    
                    let bg = 'bg-white/10';
                    if (showActive) bg = 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]';
                    else if (memoryPhase === 'guessing' && isSelected) bg = 'bg-green-500';

                    return (
                      <button
                        key={i}
                        onClick={() => answerMemory(i)}
                        className={`rounded-xl w-full h-full transition-colors duration-300 ${bg}`}
                      />
                    );
                  })}
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-white/50 mb-8">
              Daily Challenge
            </div>
            
            <h1 className="text-5xl font-black mb-4 tracking-tighter text-white">{dailyGame.name}</h1>
            <p className="text-gray-400 mb-12 text-lg">Challenge Complete!</p>
            
            <div className="flex gap-6 mb-12">
              <div className="text-center">
                <span className="block text-6xl font-black text-white">{score}</span>
                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Final Score</span>
              </div>
            </div>

            <button 
              onClick={() => setGameState('menu')}
              className="w-full max-w-[320px] py-4 bg-white text-black font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
