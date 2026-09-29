'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GREETINGS = {
  morning: [
    "Good morning. Welcome to SnapLinks.",
    "Good morning. I hope today brings great ideas.",
    "Good morning. Everything is ready for you.",
    "Welcome back. Let's build something amazing today.",
    "Morning. Your digital workspace is online."
  ],
  afternoon: [
    "Good afternoon. Welcome back.",
    "Good afternoon. Everything is running smoothly.",
    "Good afternoon. Let's make today productive.",
    "Welcome. Your dashboard is waiting."
  ],
  evening: [
    "Good evening. Nice to see you again.",
    "Good evening. Ready whenever you are.",
    "Good evening. Your workspace has been prepared.",
    "Welcome back. Let's continue where you left off."
  ],
  night: [
    "Good night. You're working late.",
    "Good night. Let's finish something meaningful.",
    "Good night. Remember to take breaks.",
    "Welcome back. Everything is ready."
  ],
  rare: [
    "Welcome back. I've been expecting you.",
    "Another day. Another opportunity to build something meaningful.",
    "Curiosity creates innovation.",
    "Great ideas often begin with a single click.",
    "Welcome back. Let's create something remarkable today."
  ]
};

const BOOT_SEQUENCE = [
  "Initializing SnapLinks AI...",
  "Loading Neural Engine...",
  "Establishing Secure Connection...",
  "Checking System Status...",
  "Loading Smart Services...",
  "Synchronizing Workspace...",
  "System Online."
];

export default function JarvisWelcome() {
  const [phase, setPhase] = useState<'hidden' | 'permission' | 'boot' | 'greet' | 'done'>('hidden');
  const [bootText, setBootText] = useState('');
  const [greetText, setGreetText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('jarvis_visited');
    const voicePref = localStorage.getItem('jarvis_voice');

    if (visited) setIsReturning(true);
    
    if (voicePref === 'true') {
      setVoiceEnabled(true);
      startSequence(true, !!visited);
    } else if (voicePref === 'false') {
      setVoiceEnabled(false);
      startSequence(false, !!visited);
    } else {
      setPhase('permission');
    }
  }, []);

  const handlePermission = (enable: boolean) => {
    localStorage.setItem('jarvis_voice', enable ? 'true' : 'false');
    setVoiceEnabled(enable);
    startSequence(enable, isReturning);
  };

  const startSequence = async (useVoice: boolean, returning: boolean) => {
    localStorage.setItem('jarvis_visited', 'true');
    
    if (!returning) {
      setPhase('boot');
      for (const line of BOOT_SEQUENCE) {
        setBootText(line);
        await new Promise(r => setTimeout(r, 600)); // 4 seconds total
      }
    }
    
    setPhase('greet');
    const message = getGreeting();
    
    // Typewriter effect
    let currentText = '';
    const interval = setInterval(() => {
      if (currentText.length < message.length) {
        currentText = message.slice(0, currentText.length + 1);
        setGreetText(currentText);
      } else {
        clearInterval(interval);
      }
    }, 50);

    if (useVoice) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(message);
      
      // Try to find a good English voice (preferably male/professional or natural female)
      const voices = synth.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.pitch = 0.9;
      utterance.rate = 0.95;
      
      utterance.onend = () => finishSequence();
      synth.speak(utterance);
    } else {
      setTimeout(finishSequence, message.length * 50 + 2000);
    }
  };

  const finishSequence = () => {
    setTimeout(() => {
      setPhase('done');
    }, 1000);
  };

  const getGreeting = () => {
    if (Math.random() < 0.01) {
      return GREETINGS.rare[Math.floor(Math.random() * GREETINGS.rare.length)];
    }
    
    const hour = new Date().getHours();
    let category = GREETINGS.morning;
    if (hour >= 12 && hour < 17) category = GREETINGS.afternoon;
    else if (hour >= 17 && hour < 21) category = GREETINGS.evening;
    else if (hour >= 21 || hour < 5) category = GREETINGS.night;
    
    return category[Math.floor(Math.random() * category.length)];
  };

  if (phase === 'hidden' || phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#05050a]/95 backdrop-blur-xl overflow-hidden font-mono"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]"></div>
          {/* Scanning line */}
          <div className="absolute left-0 right-0 h-[2px] bg-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.5)] animate-scan"></div>
        </div>
        <style>{`@keyframes scan { 0% { top: -10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 110%; opacity: 0; } } .animate-scan { animation: scan 4s linear infinite; }`}</style>

        {/* Skip Button */}
        <button 
          onClick={() => { window.speechSynthesis.cancel(); setPhase('done'); }}
          className="absolute top-6 right-8 text-cyan-500/50 hover:text-cyan-400 text-xs tracking-widest uppercase z-50 transition-colors"
        >
          Skip Intro
        </button>

        <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
          
          {phase === 'permission' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-cyan-300 mb-8 tracking-widest text-sm uppercase">Enable JARVIS Voice?</h2>
              <div className="space-y-3">
                <button onClick={() => handlePermission(true)} className="w-full py-3 bg-cyan-900/30 border border-cyan-500/50 hover:bg-cyan-800/40 text-cyan-300 rounded-lg transition-all flex items-center justify-center gap-3">
                  <span>🔊</span> Enable Voice
                </button>
                <button onClick={() => handlePermission(false)} className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 rounded-lg transition-all flex items-center justify-center gap-3">
                  <span>🔇</span> Continue Silently
                </button>
              </div>
              <p className="text-white/30 text-[10px] mt-6">☑ Remember My Choice</p>
            </motion.div>
          )}

          {phase === 'boot' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center">
              <div className="mb-12 relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-t-2 border-l-2 border-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-b-2 border-r-2 border-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-cyan-400 text-sm h-6">{bootText}</p>
            </motion.div>
          )}

          {phase === 'greet' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full text-center flex flex-col items-center">
              {/* Pulsing Orb */}
              <div className="relative w-32 h-32 mb-12">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-[0_0_50px_rgba(0,255,255,0.5)] flex items-center justify-center animate-pulse" style={{ animationDuration: '2s' }}>
                  <div className="w-full h-full rounded-full border-4 border-white/20"></div>
                </div>
              </div>
              
              <div className="h-20 flex items-center justify-center">
                <p className="text-cyan-100 text-lg sm:text-xl font-medium tracking-wide">
                  {greetText}<span className="animate-pulse">_</span>
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
