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

    if (type === 'stars') {
      for (let i = 0; i < 100; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2, speed: Math.random() * 0.5 });
    } else if (type === 'confetti') {
      const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
      for (let i = 0; i < 50; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height, size: Math.random() * 8 + 4, speed: Math.random() * 3 + 2, color: colors[Math.floor(Math.random() * colors.length)], angle: Math.random() * 360, spin: Math.random() * 5 - 2.5 });
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
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[-1]" 
      aria-hidden="true" 
    />
  );
}
