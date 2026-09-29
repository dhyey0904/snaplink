'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const EMOJI_MAP: Record<string, string> = {
  duck: '🦆', cat: '🐱', dog: '🐶', banana: '🍌', potato: '🥔', pizza: '🍕',
  fire: '🔥', meteor: '☄️', bubble: '🫧', sleep: '💤', emoji: '😂😭🥺✨💀'
};

export default function EasterEggs() {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  
  const konamiIndex = useRef(0);
  const inputBuffer = useRef('');

  useEffect(() => {
    if (localStorage.getItem('snaplinks_ai_unlocked') === 'true') {
      setAiEnabled(true);
      greetAi();
    }
  }, []);

  const greetAi = () => {
    const hour = new Date().getHours();
    if (hour < 12) setAiMessage('Good morning. Systems online.');
    else if (hour > 22) setAiMessage('It\'s getting late. Don\'t forget to sleep.');
    else setAiMessage('Welcome back to the grid.');
    setTimeout(() => setAiMessage(''), 5000);
  };

  const speakAi = (msg: string) => {
    setAiMessage(msg);
    setTimeout(() => setAiMessage(''), 5000);
  };

  const handleCommand = (cmd: string) => {
    let cleanCmd = cmd.toLowerCase().trim();
    setIsConsoleOpen(false);
    setCommand('');
    
    if (cleanCmd === 'mystery' || cleanCmd === 'surprise') {
      const all = ['matrix','coffee','hack','gravity','dvd','party','retro','pixel','space','mars','moon','earthquake','ghost','rain','snow','ice','galaxy','neon','spin','flip','chaos','glitch','disco','laser','gold','rainbow','cinema','storm'];
      cleanCmd = all[Math.floor(Math.random() * all.length)];
    }
    
    if (cleanCmd === 'jarvis') {
      setAiEnabled(true);
      localStorage.setItem('snaplinks_ai_unlocked', 'true');
      speakAi('AI Core activated. At your service.');
      return;
    }
    
    if (cleanCmd === 'clear' || cleanCmd === 'reset' || cleanCmd === 'exit') {
      setActiveEffect(null);
      document.body.className = document.body.className.replace(/theme-[\w-]+/g, '').trim();
      document.body.style.cssText = '';
      return;
    }

    applyEffect(cleanCmd);
  };

  const applyEffect = (effect: string) => {
    setActiveEffect(effect);
    document.body.className = document.body.className.replace(/theme-[\w-]+/g, '').trim();
    document.body.style.cssText = '';
    
    switch (effect) {
      case 'matrix': speakAi('Entering the Matrix.'); break;
      case 'coffee': speakAi('Brewing virtual coffee...'); break;
      case 'hack': speakAi('Bypassing mainframe security...'); break;
      case 'duck': speakAi('Release the quackin.'); break;
      case 'cat': speakAi('Meow.'); break;
      case 'dog': speakAi('Woof.'); break;
      case 'banana': speakAi('Potassium levels rising.'); break;
      case 'potato': speakAi('GLaDOS mode engaged.'); break;
      case 'pizza': speakAi('Cowabunga!'); break;
      case 'sleep': speakAi('Zzz...'); break;
      case 'fire': speakAi('This is fine.'); break;
      case 'bubble': speakAi('Pop pop.'); break;
      case 'meteor': speakAi('Brace for impact.'); break;
      case 'emoji': speakAi('Gen Z mode enabled.'); break;
      case 'gravity': document.body.classList.add('theme-gravity'); speakAi('Warning: Gravity stabilizers offline.'); break;
      case 'dvd': speakAi('Watching it hit the corner...'); break;
      case 'party': confetti({ particleCount: 300, spread: 160 }); speakAi('Party time!'); setTimeout(() => setActiveEffect(null), 5000); break;
      case 'retro': document.body.style.fontFamily = '"Times New Roman", Times, serif'; document.body.style.backgroundColor = '#c0c0c0'; document.body.style.color = '#000'; speakAi('Windows 95 mode.'); break;
      case 'pixel': document.body.style.filter = 'contrast(1.5) grayscale(0.5) blur(1px)'; speakAi('8-bit graphics enabled.'); break;
      case 'pirate': speakAi('Yarrr! Shiver me timbers!'); break;
      case 'wizard': speakAi('You\'re a wizard.'); break;
      case 'space': document.body.style.backgroundColor = '#000'; speakAi('To infinity and beyond.'); break;
      case 'mars': document.body.style.filter = 'sepia(1) hue-rotate(-50deg) saturate(2)'; speakAi('Welcome to the red planet.'); break;
      case 'moon': document.body.style.transition = 'all 2s ease'; speakAi('Low gravity environment detected.'); break;
      case 'earthquake': document.body.classList.add('theme-earthquake'); speakAi('Seismic activity detected.'); break;
      case 'ghost': document.body.style.opacity = '0.4'; speakAi('Spooky.'); break;
      case 'rain': speakAi('Rain protocol activated.'); break;
      case 'snow': speakAi('Winter protocol activated.'); break;
      case 'ice': document.body.style.filter = 'hue-rotate(180deg) saturate(2) brightness(1.5)'; speakAi('Ice age.'); break;
      case 'galaxy': speakAi('Entering deep space.'); break;
      case 'neon': document.body.classList.add('theme-neon'); speakAi('Cyberpunk 2077 mode.'); break;
      case 'spin': document.body.style.animation = 'spin 2s linear infinite'; speakAi('Try not to get dizzy.'); break;
      case 'flip': document.body.style.transform = 'scaleX(-1)'; speakAi('Mirror dimension accessed.'); break;
      case 'chaos': document.body.classList.add('theme-chaos'); speakAi('Absolute chaos.'); break;
      case 'glitch': document.body.classList.add('theme-glitch'); speakAi('S-s-systems f-f-failing...'); break;
      case 'disco': document.body.classList.add('theme-disco'); speakAi('Disco fever!'); break;
      case 'laser': speakAi('Laser defense grid active.'); break;
      case 'comet': speakAi('Make a wish.'); break;
      case 'robot': speakAi('BEEP BOOP. I AM A ROBOT.'); break;
      case 'alien': speakAi('⏃⌰⟟⟒⋏ ⌇☍⟒⟒⏚ ⟒⟒⌿'); break;
      case 'fortune': 
        const fortunes = ["You will find a bug today.", "Your code will compile on the first try.", "Beware of infinite loops."];
        speakAi(fortunes[Math.floor(Math.random()*fortunes.length)]); 
        setActiveEffect(null);
        break;
      case 'gold': document.body.style.filter = 'sepia(1) hue-rotate(10deg) saturate(3)'; speakAi('Everything is gold.'); break;
      case 'rainbow': document.body.classList.add('theme-rainbow'); speakAi('Taste the rainbow.'); break;
      case 'music': speakAi('Playing imaginary background track...'); setActiveEffect(null); break;
      case 'cinema': document.body.classList.add('theme-cinema'); speakAi('Quiet on set. Action!'); break;
      case 'storm': document.body.classList.add('theme-storm'); speakAi('Thunderstorm approaching.'); break;
      case 'legend': confetti({ particleCount: 500, spread: 360, colors: ['#ffd700', '#ffaa00']}); speakAi('🏆 You unlocked the Legendary Badge!'); setActiveEffect(null); break;
      default:
        speakAi(`Command '${effect}' not recognized by AI Core.`);
        setActiveEffect(null);
        break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'Space') { e.preventDefault(); setIsConsoleOpen(prev => !prev); return; }
      if (e.code === 'Escape' && isConsoleOpen) setIsConsoleOpen(false);
      if (!isConsoleOpen && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) return;

      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          konamiIndex.current = 0; applyEffect('party'); speakAi('Konami code accepted. +30 Lives.');
        }
      } else konamiIndex.current = 0;

      if (!isConsoleOpen && e.key.length === 1) {
        inputBuffer.current = (inputBuffer.current + e.key).slice(-10);
        if (inputBuffer.current.endsWith('/secret')) { setIsConsoleOpen(true); inputBuffer.current = ''; }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConsoleOpen]);

  useEffect(() => {
    if (!document.getElementById('secret-styles')) {
      const style = document.createElement('style');
      style.id = 'secret-styles';
      style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes bounceDvd { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(calc(100vw - 100px), calc(100vh - 100px)); } 50% { transform: translate(0, calc(100vh - 100px)); } 75% { transform: translate(calc(100vw - 100px), 0); } }
        .theme-glitch { animation: glitch 0.2s infinite; }
        @keyframes glitch { 0% { transform: translate(2px, 2px); filter: hue-rotate(90deg); } 50% { transform: translate(-2px, -2px); filter: hue-rotate(-90deg); } 100% { transform: translate(2px, -2px); filter: hue-rotate(0deg); } }
        .theme-gravity * { animation: fall 3s forwards ease-in !important; }
        @keyframes fall { to { transform: translateY(100vh) rotate(45deg); opacity: 0; } }
        .theme-earthquake { animation: shake 0.1s infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }
        .theme-chaos { animation: spin 0.5s infinite, shake 0.2s infinite, discoBg 0.5s infinite; }
        .theme-neon * { text-shadow: 0 0 5px #0ff, 0 0 10px #0ff !important; box-shadow: 0 0 5px #0ff !important; border-color: #0ff !important; }
        .theme-disco { animation: discoBg 1s infinite alternate; }
        @keyframes discoBg { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .theme-rainbow { animation: rainbowBg 5s linear infinite; }
        @keyframes rainbowBg { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .theme-cinema::before, .theme-cinema::after { content: ''; position: fixed; left: 0; right: 0; height: 10vh; background: black; z-index: 999999; }
        .theme-cinema::before { top: 0; } .theme-cinema::after { bottom: 0; }
        .theme-storm { animation: lightning 5s infinite; }
        @keyframes lightning { 0%, 95%, 100% { filter: invert(0); } 96%, 98% { filter: invert(1) brightness(2); } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Helper for falling particles (emojis, rain, snow, code)
  const renderParticles = (charMap: string | string[], count: number, speedMultiplier = 1, isUp = false) => {
    return Array.from({length: count}).map((_, i) => {
      const char = Array.isArray(charMap) ? charMap[Math.floor(Math.random()*charMap.length)] : charMap;
      return (
        <div key={i} className="absolute whitespace-nowrap opacity-70" 
             style={{ 
               left: `${Math.random()*100}%`, 
               top: isUp ? '100%' : `-${Math.random()*100}%`, 
               animation: `${isUp ? 'floatUp' : 'fall'} ${2 + Math.random()*3*speedMultiplier}s linear infinite`, 
               fontSize: `${12+Math.random()*24}px` 
             }}>
          {char}
        </div>
      );
    });
  };

  return (
    <>
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setIsConsoleOpen(false)}>
            <div className="w-full max-w-2xl bg-[#0a0a0a]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,255,255,0.1)] backdrop-blur-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4 text-cyan-400 font-mono">
                <span className="text-xl">o(</span><span className="tracking-widest uppercase text-sm">SnapLinks Secret Console</span>
              </div>
              <p className="text-cyan-400/50 font-mono text-xs mb-6">50+ hidden commands available. Try 'matrix', 'jarvis', 'dog', 'disco', 'cinema', 'storm' or 'reset'.</p>
              <form onSubmit={e => { e.preventDefault(); handleCommand(command); }} className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-mono">{">"}</span>
                <input autoFocus type="text" value={command} onChange={e => setCommand(e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/50 rounded-xl py-4 pl-10 pr-4 text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all"
                  placeholder="Enter hidden command..." autoComplete="off" spellCheck="false" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aiEnabled && (
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
            <AnimatePresence>
              {aiMessage && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 font-mono text-sm px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.15)] max-w-xs text-right">
                  {aiMessage}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative w-12 h-12 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 shadow-[0_0_30px_rgba(0,255,255,0.3)] flex items-center justify-center pointer-events-auto cursor-help hover:bg-cyan-500/30 transition-colors group" onClick={() => speakAi('I am listening.')}>
              <div className="absolute inset-2 bg-cyan-400 rounded-full animate-ping opacity-20"></div>
              <div className="w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_10px_#fff]"></div>
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-cyan-300 text-[10px] px-2 py-1 rounded whitespace-nowrap font-mono">AI Core Online</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAYS */}
      {activeEffect && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          {activeEffect === 'matrix' && <div className="absolute inset-0 bg-black/90 text-green-500 font-mono mix-blend-color-dodge opacity-50">{renderParticles(['0','1','日','ﾊ','ﾐ','ﾋ','ｰ','ｳ','ｼ','ﾅ','ﾓ','ﾆ','ｻ','ﾜ','ﾂ','ｵ','ﾘ','ｱ','ﾎ','ﾃ','ﾏ','ｹ','ﾒ','ｴ','ｶ','ｷ','ﾑ','ﾕ','ﾗ','ｾ','ﾈ','ｽ','ﾀ','ﾇ','ﾍ'], 100, 2)}</div>}
          {EMOJI_MAP[activeEffect] && renderParticles([...EMOJI_MAP[activeEffect]], 50, 1, activeEffect==='bubble')}
          {activeEffect === 'snow' && renderParticles(['.', '❄'], 150, 2)}
          {activeEffect === 'rain' && <div className="text-blue-400 font-mono opacity-40">{renderParticles(['|'], 200, 0.5)}</div>}
          {activeEffect === 'space' && <div className="absolute inset-0 bg-black text-white">{renderParticles(['.', '✨', '*'], 200, 5)}</div>}
          {activeEffect === 'galaxy' && <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-black mix-blend-multiply text-white">{renderParticles(['.', '✨', '*'], 200, 10)}</div>}
          {activeEffect === 'wizard' && renderParticles(['✨', '🪄', '⭐'], 40)}
          {activeEffect === 'laser' && (
             <div className="absolute inset-0 flex flex-col justify-between opacity-50">
               {Array.from({length: 10}).map((_, i) => <div key={i} className="w-full h-1 bg-red-500 shadow-[0_0_10px_red]" style={{animation: `shake ${0.1+Math.random()*0.5}s infinite`}}/>)}
             </div>
          )}
          {activeEffect === 'hack' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-red-500 font-mono text-6xl font-black animate-pulse">HACKING IN PROGRESS...</div>
            </div>
          )}
          {activeEffect === 'comet' && (
            <div className="absolute w-32 h-1 bg-white shadow-[0_0_20px_white] rotate-45" style={{animation: 'fall 1s linear infinite'}} />
          )}
          {activeEffect === 'dvd' && (
            <div className="absolute w-40 h-20 font-black text-7xl text-white mix-blend-difference" style={{ animation: 'bounceDvd 10s linear infinite' }}>SNAP</div>
          )}
        </div>
      )}
      
      {/* Upward animation for bubbles */}
      <style>{`@keyframes floatUp { to { transform: translateY(-100vh); opacity: 0; } }`}</style>
    </>
  );
}
