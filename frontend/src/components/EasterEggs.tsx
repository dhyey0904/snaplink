'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function EasterEggs() {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  
  const konamiIndex = useRef(0);
  const inputBuffer = useRef('');

  useEffect(() => {
    // Check if AI was previously enabled
    if (localStorage.getItem('snaplinks_ai_unlocked') === 'true') {
      setAiEnabled(true);
      greetAi();
    }
    
    // Load previously active effect if any (optional, usually better to reset)
  }, []);

  const greetAi = () => {
    const hour = new Date().getHours();
    if (hour < 12) setAiMessage('Good morning. Systems online.');
    else if (hour > 22) setAiMessage('It\'s getting late. Don\'t forget to sleep.');
    else setAiMessage('Welcome back to the grid.');
    
    setTimeout(() => setAiMessage(''), 5000);
  };

  const speakAi = (msg: string) => {
    console.log("[Secret OS]: " + msg);
  };

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().trim();
    setIsConsoleOpen(false);
    setCommand('');
    
    if (cleanCmd === 'jarvis') {
      setAiEnabled(true);
      localStorage.setItem('snaplinks_ai_unlocked', 'true');
      speakAi('AI Core activated. At your service.');
      return;
    }
    
    if (cleanCmd === 'clear' || cleanCmd === 'reset' || cleanCmd === 'exit') {
      setActiveEffect(null);
      document.body.style.transform = '';
      document.body.style.animation = '';
      document.body.style.filter = '';
      return;
    }

    applyEffect(cleanCmd);
  };

  const applyEffect = (effect: string) => {
    setActiveEffect(effect);
    document.body.style.transform = '';
    document.body.style.animation = '';
    document.body.style.filter = '';
    
    switch (effect) {
      case 'matrix':
        speakAi('Entering the Matrix.');
        break;
      case 'coffee':
        speakAi('Brewing virtual coffee...');
        break;
      case 'party':
        confetti({ particleCount: 200, spread: 160 });
        speakAi('Party time!');
        setTimeout(() => setActiveEffect(null), 3000);
        break;
      case 'spin':
        document.body.style.animation = 'spin 2s linear infinite';
        speakAi('Try not to get dizzy.');
        break;
      case 'flip':
        document.body.style.transform = 'scaleX(-1)';
        speakAi('Mirror dimension accessed.');
        break;
      case 'gravity':
        speakAi('Warning: Gravity stabilizers offline.');
        break;
      case 'dvd':
        speakAi('Watching it hit the corner...');
        break;
      case 'glitch':
        speakAi('S-s-systems f-f-failing...');
        break;
      case 'snow':
        speakAi('Winter protocol activated.');
        break;
      case 'pixel':
        document.body.style.filter = 'contrast(1.5) grayscale(0.5) blur(1px)'; // Fake retro
        speakAi('1995 graphics mode.');
        break;
      case 'invert':
        document.body.style.filter = 'invert(1)';
        speakAi('Darkness falls.');
        break;
      case 'ghost':
        document.body.style.opacity = '0.5';
        speakAi('Spooky.');
        break;
      case 'chaos':
        document.body.style.animation = 'spin 0.5s infinite, shake 0.2s infinite';
        speakAi('Absolute chaos.');
        break;
      default:
        speakAi(`Command '${effect}' not recognized by AI Core.`);
        setActiveEffect(null);
        break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle console
      if (e.ctrlKey && e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        setIsConsoleOpen(prev => !prev);
        return;
      }
      
      // Escape closes
      if (e.code === 'Escape' && isConsoleOpen) {
        setIsConsoleOpen(false);
      }

      // Ignore typing if in an input, UNLESS it's our console
      if (!isConsoleOpen && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        return;
      }

      // Konami Code
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          konamiIndex.current = 0;
          applyEffect('party');
          speakAi('Konami code accepted. +30 Lives.');
        }
      } else {
        konamiIndex.current = 0;
      }

      // Buffer for direct typing of easter eggs
      if (!isConsoleOpen && e.key.length === 1) {
        inputBuffer.current = (inputBuffer.current + e.key.toLowerCase()).slice(-20);
        
        // Open console on /secret
        if (inputBuffer.current.endsWith('/secret')) {
          setIsConsoleOpen(true);
          inputBuffer.current = '';
          return;
        }
        
        // List of all direct trigger commands
        const triggers = ['jarvis', 'clear', 'reset', 'exit', 'matrix', 'coffee', 'party', 'spin', 'flip', 'gravity', 'dvd', 'glitch', 'snow', 'pixel', 'invert', 'ghost', 'chaos'];
        
        for (const trigger of triggers) {
          if (inputBuffer.current.endsWith(trigger)) {
            handleCommand(trigger);
            inputBuffer.current = ''; // clear buffer so it doesn't double trigger
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConsoleOpen]);

  // Handle global CSS injections
  useEffect(() => {
    if (!document.getElementById('secret-styles')) {
      const style = document.createElement('style');
      style.id = 'secret-styles';
      style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes bounceDvd {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(calc(100vw - 100px), calc(100vh - 100px)); }
          50% { transform: translate(0, calc(100vh - 100px)); }
          75% { transform: translate(calc(100vw - 100px), 0); }
        }
        .theme-glitch { animation: glitch 0.2s infinite; }
        @keyframes glitch { 0% { transform: translate(2px, 2px); } 50% { transform: translate(-2px, -2px); } 100% { transform: translate(2px, -2px); } }
        .gravity-fall { animation: fall 2s forwards ease-in; }
        @keyframes fall { to { transform: translateY(100vh) rotate(45deg); opacity: 0; } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <>
      {/* Secret Console Modal */}
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsConsoleOpen(false)}
          >
            <div 
              className="w-full max-w-2xl bg-[#0a0a0a]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,255,255,0.1)] backdrop-blur-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4 text-cyan-400 font-mono">
                <span className="text-xl">o(</span>
                <span className="tracking-widest uppercase text-sm">SnapLinks Secret Console</span>
              </div>
              <p className="text-cyan-400/50 font-mono text-xs mb-6">Type a secret command. Try 'matrix', 'jarvis', 'spin', 'gravity', or 'reset'.</p>
              
              <form onSubmit={e => { e.preventDefault(); handleCommand(command); }} className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-mono">{">"}</span>
                <input 
                  autoFocus
                  type="text" 
                  value={command}
                  onChange={e => setCommand(e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/50 rounded-xl py-4 pl-10 pr-4 text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all"
                  placeholder="Enter hidden command..."
                  autoComplete="off"
                  spellCheck="false"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Global Visual Overlays */}
      {activeEffect === 'matrix' && (
        <div className="fixed inset-0 z-[9998] pointer-events-none bg-black/90 flex flex-col font-mono text-green-500 overflow-hidden opacity-30 mix-blend-color-dodge">
          {Array.from({length: 40}).map((_, i) => (
            <div key={i} className="absolute whitespace-nowrap" style={{ left: `${Math.random()*100}%`, top: `-${Math.random()*100}%`, animation: `fall ${2 + Math.random()*3}s linear infinite`, writingMode: 'vertical-rl', fontSize: `${10+Math.random()*14}px` }}>
              {Array.from({length: 30}).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
            </div>
          ))}
        </div>
      )}
      
      {activeEffect === 'snow' && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          {Array.from({length: 50}).map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full opacity-60" style={{ left: `${Math.random()*100}%`, top: `-${Math.random()*20}%`, width: `${2+Math.random()*6}px`, height: `${2+Math.random()*6}px`, animation: `fall ${3 + Math.random()*5}s linear infinite` }} />
          ))}
        </div>
      )}

      {activeEffect === 'dvd' && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden mix-blend-difference">
          <div className="absolute w-32 h-16 font-black text-5xl text-white" style={{ animation: 'bounceDvd 10s linear infinite' }}>
            SNAP
          </div>
        </div>
      )}

      {activeEffect === 'coffee' && (
        <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center bg-[#4a3b32]/40 backdrop-blur-sm">
          <div className="text-[150px] animate-pulse drop-shadow-2xl">☕</div>
          {/* Steam particles */}
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} className="absolute text-4xl text-white/30 filter blur-md" style={{ animation: `floatUp ${3 + Math.random()*2}s ease-in-out infinite`, left: `calc(50% - 40px + ${Math.random()*80}px)`, top: 'calc(50% - 100px)' }}>~</div>
          ))}
          <style>{`@keyframes floatUp { 0% { transform: translateY(0) scale(1); opacity: 0.8; } 100% { transform: translateY(-200px) scale(2); opacity: 0; } }`}</style>
        </div>
      )}
    </>
  );
}
