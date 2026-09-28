'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

type Question = {
  id: number;
  title: string;
  emoji?: string;
  options: { label: string; icon?: string; value: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'How many Chrome tabs are open right now?',
    emoji: '🌐',
    options: [
      { label: '1-5 (Zen)', value: 'low_tabs' },
      { label: '6-20 (Normal)', value: 'med_tabs' },
      { label: '21-50 (Messy)', value: 'high_tabs' },
      { label: '50+ (Help)', value: 'max_tabs' },
    ]
  },
  {
    id: 2,
    title: 'What fuels your existence?',
    emoji: '⛽',
    options: [
      { label: 'Coffee', icon: '☕', value: 'coffee' },
      { label: 'Tea', icon: '🍵', value: 'tea' },
      { label: 'Energy Drinks', icon: '🥤', value: 'energy' },
      { label: 'Just Water', icon: '💧', value: 'water' },
    ]
  },
  {
    id: 3,
    title: 'Dark Mode preference?',
    emoji: '🌙',
    options: [
      { label: 'Always', value: 'dark' },
      { label: 'Sometimes', value: 'auto' },
      { label: 'Never', value: 'light' },
    ]
  },
  {
    id: 4,
    title: 'How fast do you reply?',
    emoji: '📱',
    options: [
      { label: 'Instantly', value: 'fast' },
      { label: 'Within an hour', value: 'med' },
      { label: 'Tomorrow', value: 'slow' },
      { label: 'Never 😂', value: 'never' },
    ]
  },
  {
    id: 5,
    title: 'Ideal weekend plan?',
    emoji: '🗓️',
    options: [
      { label: 'Sleep', value: 'sleep' },
      { label: 'Gaming', value: 'gaming' },
      { label: 'Coding', value: 'coding' },
      { label: 'Travel', value: 'travel' },
      { label: 'Watching Reels', value: 'scrolling' },
    ]
  },
  {
    id: 6,
    title: 'Daily screen time?',
    emoji: '⏱️',
    options: [
      { label: 'Under 2h', value: '2h' },
      { label: 'Around 4h', value: '4h' },
      { label: '6h+', value: '6h' },
      { label: '8h+ (Chronically Online)', value: '8h' },
    ]
  },
  {
    id: 7,
    title: 'Most used emoji?',
    emoji: '🎭',
    options: [
      { label: 'Tears of Joy', icon: '😂', value: 'joy' },
      { label: 'Sobbing', icon: '😭', value: 'sob' },
      { label: 'Fire', icon: '🔥', value: 'fire' },
      { label: 'Sparkles', icon: '✨', value: 'sparkle' },
      { label: 'Skull', icon: '💀', value: 'skull' },
      { label: 'Cool', icon: '😎', value: 'cool' },
    ]
  },
  {
    id: 8,
    title: 'Your biggest weakness?',
    emoji: '🎯',
    options: [
      { label: 'Overthinking', value: 'overthink' },
      { label: 'Procrastination', value: 'procrastinate' },
      { label: 'Buying courses & never watching', value: 'courses' },
      { label: 'Doomscrolling', value: 'doomscroll' },
      { label: 'Opening YouTube while studying', value: 'youtube' },
    ]
  }
];

const PERSONALITIES = [
  { id: 'chaos', name: 'Chaos Engineer', desc: '"You don\'t fix bugs, you create features."', luck: '12%', power: 'Can navigate 100 tabs blindly' },
  { id: 'overthinker', name: 'Professional Overthinker', desc: '"Drafting a 2-word reply for 45 minutes."', luck: '45%', power: 'Predicting 14 fake scenarios per minute' },
  { id: 'coffee', name: 'Coffee Powered Human', desc: '"Blood type: Arabica Dark Roast."', luck: '99%', power: 'Vibrating through solid walls' },
  { id: 'meme', name: 'Meme Research Scientist', desc: '"I have a meme for this exact situation."', luck: '69%', power: 'Communicating entirely in TikTok sounds' },
  { id: 'ghost', name: 'Weekend Ghost', desc: '"Read 9:42 AM. Replied: Next Tuesday."', luck: '33%', power: 'Disappearing into the digital void' },
  { id: '404', name: '404 Soul Not Found', desc: '"Error: Motivation failed to load."', luck: '404%', power: 'Sleeping through 14 alarms' },
  { id: 'wizard', name: 'Internet Wizard', desc: '"I know exactly what to Google to fix this."', luck: '88%', power: 'Finding the exact Reddit thread from 2014' },
];

export default function VibeApp() {
  const [step, setStep] = useState<'landing' | 'quiz' | 'analyzing' | 'result'>('landing');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [analysisText, setAnalysisText] = useState('Initializing Scanner...');
  const [result, setResult] = useState<any>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    // Play tiny click sound if wanted
    setStep('quiz');
  };

  const handleAnswer = (val: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentQIndex].id]: val }));
    
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setStep('analyzing');
    
    const steps = [
      'Scanning Internet Footprint...',
      'Reading Browser Aura...',
      'Calculating Chaos Factor...',
      'Analyzing Coffee Dependency...',
      'Comparing with 2,000,000 Users...',
      'Generating Unique Vibe ID...',
      'Done.'
    ];

    let i = 0;
    const interval = setInterval(() => {
      setAnalysisText(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          generateResult();
          setStep('result');
        }, 1000);
      }
    }, 800);
  };

  const generateResult = () => {
    // Simple logic based on answers
    const vals = Object.values(answers);
    let persona = PERSONALITIES[0]; // Default Chaos

    if (vals.includes('overthink') || vals.includes('med')) persona = PERSONALITIES[1]; // Overthinker
    if (vals.includes('coffee')) persona = PERSONALITIES[2]; // Coffee
    if (vals.includes('scrolling') || vals.includes('skull') || vals.includes('doomscroll')) persona = PERSONALITIES[3]; // Meme
    if (vals.includes('never') || vals.includes('sleep') || vals.includes('slow')) persona = PERSONALITIES[4]; // Ghost
    if (vals.includes('light') && vals.includes('never')) persona = PERSONALITIES[5]; // 404
    if (vals.includes('coding') && vals.includes('dark')) persona = PERSONALITIES[6]; // Wizard

    // Rare chance overrides
    if (Math.random() < 0.01) {
      persona = { id: 'golden', name: '✨ Golden Internet Citizen ✨', desc: '"1 in 20,000. You are the chosen one."', luck: '9999%', power: 'Pure untouchable aura' };
    }

    setResult(persona);
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = 'my-internet-vibe-id.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full relative z-10 pt-8 pb-12 px-2">
      
      {/* Branding */}
      <div className="absolute top-6 left-0 right-0 flex justify-center opacity-60">
        <span className="text-xs font-bold tracking-widest uppercase text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
          SnapLabs Experience
        </span>
      </div>

      <AnimatePresence mode="wait">
        
        {/* LANDING */}
        {step === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center mt-12"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.5)] flex items-center justify-center mb-8 border border-white/20 backdrop-blur-xl"
            >
              <span className="text-5xl">🌐</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/70">
              Internet Vibe ID™
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-[280px] leading-relaxed">
              The internet already has an opinion about you. Let's see what it is.
            </p>
            <button 
              onClick={handleStart}
              className="group relative px-10 py-4 bg-white text-black font-extrabold text-lg rounded-full overflow-hidden hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              Start Analysis &rarr;
            </button>
          </motion.div>
        )}

        {/* QUIZ */}
        {step === 'quiz' && (
          <motion.div 
            key={`q-${currentQIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col justify-center mt-12"
          >
            <div className="text-center mb-8">
              <span className="text-6xl block mb-6 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{QUESTIONS[currentQIndex].emoji}</span>
              <p className="text-xs text-blue-400 font-bold tracking-widest uppercase mb-3">Question {currentQIndex + 1} of 8</p>
              <h2 className="text-2xl font-bold px-4 leading-tight">{QUESTIONS[currentQIndex].title}</h2>
            </div>

            <div className="flex flex-col gap-3 w-full px-4">
              {QUESTIONS[currentQIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-left font-medium flex items-center transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
                >
                  {opt.icon && <span className="mr-3 text-xl">{opt.icon}</span>}
                  <span className="text-gray-200">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANALYZING */}
        {step === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center font-mono"
          >
            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Analyzing...</h2>
            <p className="text-blue-400 text-sm h-6">{analysisText}</p>
          </motion.div>
        )}

        {/* RESULT */}
        {step === 'result' && result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center pt-8 w-full"
          >
            {/* The Actual Exportable Card */}
            <div 
              ref={cardRef}
              className="w-full aspect-[9/16] max-h-[70vh] sm:max-h-none sm:w-[320px] sm:h-[568px] relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 bg-[#0a0a0a] flex flex-col"
            >
              {/* Card Background Effects */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-600/30 rounded-full blur-[60px]"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-600/30 rounded-full blur-[60px]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌐</span>
                    <span className="text-[10px] font-black tracking-widest text-white/70 uppercase">Internet Vibe ID</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">#{Math.floor(Math.random() * 90000) + 10000}</span>
                </div>

                {/* Persona */}
                <div className="py-8 text-center">
                  <h3 className="text-3xl font-black uppercase tracking-tight leading-none mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                    {result.name}
                  </h3>
                  <p className="text-xs text-blue-300 font-medium italic px-4">
                    {result.desc}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-3 mt-auto bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase font-bold tracking-wider">Chaos Level</span>
                    <span className="text-white font-mono">{Math.floor(Math.random() * 40 + 60)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase font-bold tracking-wider">Social Battery</span>
                    <span className="text-white font-mono">{Math.floor(Math.random() * 90 + 10)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase font-bold tracking-wider">Internet Luck</span>
                    <span className="text-white font-mono">{result.luck}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase font-bold tracking-wider">Special Power</span>
                  </div>
                  <div className="text-[10px] text-white/90 leading-tight">
                    {result.power}
                  </div>
                </div>

                {/* Footer Logo */}
                <div className="mt-6 flex justify-center opacity-50">
                  <span className="text-[9px] uppercase tracking-widest font-bold">Created with SnapLabs</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 w-full max-w-[320px]">
              <button 
                onClick={downloadImage}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Save to Camera Roll
              </button>
              
              <button 
                onClick={() => setStep('landing')}
                className="w-full py-3 text-white/50 text-sm font-medium hover:text-white transition-colors"
              >
                Retake Analysis
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
