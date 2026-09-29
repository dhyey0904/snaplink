"use client";
import { useEffect, useRef } from 'react';

export default function ThemeParticles({ type }: { type: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || type === 'none') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    let animationFrame: number;

    const emojis: Record<string, string[]> = {
      'diwali': ['🪔', '🎇', '✨', '🎆'],
      'holi': ['🎨', '🌈', '🔴', '🟡', '🟣', '🟢'],
      'navratri': ['💃', '🥁', '🌸', '✨'],
      'pongal': ['🌾', '🌞', '🥥', '🍯'],
      'eid': ['🌙', '🌟', '✨', '🕌'],
      'christmas': ['❄️', '🎄', '🎁', '⛄'],
      'newyear': ['🎆', '🥂', '🎉', '🎊']
    };

    if (type === 'stars') {
      for (let i = 0; i < 100; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2, speed: Math.random() * 0.5 });
    } else if (type === 'confetti') {
      const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
      for (let i = 0; i < 50; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height, size: Math.random() * 8 + 4, speed: Math.random() * 3 + 2, color: colors[Math.floor(Math.random() * colors.length)], angle: Math.random() * 360, spin: Math.random() * 5 - 2.5 });
    } else if (emojis[type]) {
      const symbols = emojis[type];
      for (let i = 0; i < 40; i++) particles.push({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height - canvas.height, 
        size: Math.random() * 30 + 20, 
        speed: Math.random() * 2 + 1, 
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        angle: Math.random() * 360, 
        spin: (Math.random() - 0.5) * 2 
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (type === 'stars') {
        ctx.fillStyle = '#fff';
        particles.forEach(p => {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          p.y -= p.speed;
          if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        });
      } else if (type === 'confetti') {
        particles.forEach(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angle * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
          
          p.y += p.speed;
          p.angle += p.spin;
          if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
        });
      } else if (emojis[type]) {
        particles.forEach(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angle * Math.PI) / 180);
          ctx.font = `${p.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.symbol, 0, 0);
          ctx.restore();
          
          p.y += p.speed;
          p.angle += p.spin;
          if (p.y > canvas.height) { p.y = -50; p.x = Math.random() * canvas.width; }
        });
      }
      
      animationFrame = requestAnimationFrame(draw);
    };
    
    draw();
    
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[999]" 
        aria-hidden="true" 
      />
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-[-2] overflow-hidden">
        <h1 className="text-[12vw] font-black whitespace-nowrap text-center leading-none">
          {type === 'diwali' ? 'HAPPY DIWALI' :
           type === 'holi' ? 'HAPPY HOLI' :
           type === 'navratri' ? 'HAPPY NAVRATRI' :
           type === 'pongal' ? 'HAPPY PONGAL' :
           type === 'eid' ? 'EID MUBARAK' :
           type === 'christmas' ? 'MERRY CHRISTMAS' :
           type === 'newyear' ? 'HAPPY NEW YEAR' : ''}
        </h1>
      </div>
    </>
  );
}
