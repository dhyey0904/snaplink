"use client";

import { useEffect, useState } from 'react';
import ThemeParticles from './ThemeParticles';

const themes = {
  Monday: {
    name: "Cyber Monday",
    css: `
      body { background-color: #000 !important; font-family: "Courier New", monospace !important; color: #0f0 !important; cursor: crosshair; }
      .bg-white, .bg-gray-50 { background-color: #111 !important; border-color: #0f0 !important; }
      .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500 { color: #0f0 !important; }
      .bg-[#1557b0] { background-color: #0f0 !important; color: #000 !important; }
      .text-[#1557b0] { color: #0f0 !important; }
      * { border-radius: 0 !important; box-shadow: none !important; }
    `,
    particles: 'matrix'
  },
  Tuesday: {
    name: "Nature Tuesday",
    css: `
      body { background-color: #f0fdf4 !important; }
      .bg-white { background-color: #f0fdf4 !important; }
      .text-[#1557b0] { color: #16a34a !important; }
      .bg-[#1557b0] { background-color: #16a34a !important; }
      .border-[#1557b0] { border-color: #16a34a !important; }
    `,
    particles: 'leaves'
  },
  Wednesday: {
    name: "Mystery Wednesday",
    css: `
      body { filter: invert(0.8) hue-rotate(90deg); background-color: #111 !important; }
    `,
    particles: 'none'
  },
  Thursday: {
    name: "Retro Thursday",
    css: `
      body { font-family: "Courier New", monospace !important; background-color: #222 !important; }
      .bg-white { background-color: #ccc !important; border: 4px solid #fff !important; }
      * { border-radius: 0 !important; }
    `,
    particles: 'pixels'
  },
  Friday: {
    name: "Party Friday",
    css: `
      body { background: linear-gradient(45deg, #ff00ff, #00ffff) !important; }
      .bg-white { background-color: rgba(255,255,255,0.8) !important; backdrop-filter: blur(10px); }
    `,
    particles: 'confetti'
  },
  Saturday: {
    name: "Galaxy Saturday",
    css: `
      body { background-color: #090a0f !important; color: #fff !important; }
      .bg-white, .bg-gray-50 { background-color: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; }
      .text-gray-900, .text-gray-800, .text-gray-700 { color: #fff !important; }
      .text-gray-600, .text-gray-500, .text-gray-400 { color: #ccc !important; }
    `,
    particles: 'stars'
  },
  Sunday: {
    name: "Minimal Sunday",
    css: `
      body { background-color: #fafafa !important; filter: grayscale(100%); }
    `,
    particles: 'none'
  }
};

const specialEvents: Record<string, {name: string, css: string, particles: string}> = {
  "halloween": { name: "Halloween", css: `body { background-color: #000 !important; } .bg-white { background-color: #111 !important; } .text-gray-900 { color: #f97316 !important; }`, particles: 'bats' },
  "christmas": { name: "Christmas", css: `body { background-color: #fff !important; }`, particles: 'snow' },
  "diwali": { name: "Happy Diwali", css: `body { background: linear-gradient(135deg, #1a0b2e, #4a1c40) !important; color: #fbbf24 !important; } .bg-white { background-color: rgba(0,0,0,0.5) !important; border-color: #fbbf24 !important; } .text-gray-900, .text-gray-800 { color: #fbbf24 !important; }`, particles: 'diwali' },
  "navratri": { name: "Happy Navratri", css: `body { background: linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6) !important; } .bg-white { background-color: rgba(255,255,255,0.9) !important; border: 2px solid #ec4899 !important; }`, particles: 'navratri' },
  "holi": { name: "Happy Holi", css: `body { background: linear-gradient(to right, #ff0080, #ff8c00, #40e0d0, #ff0080) !important;  } .bg-white { background-color: rgba(255,255,255,0.85) !important; border-radius: 40px !important; }`, particles: 'holi' },
  "pongal": { name: "Happy Pongal", css: `body { background-color: #fef3c7 !important; } .bg-white { background-color: #fffbeb !important; border-color: #f59e0b !important; } .text-[#1557b0] { color: #16a34a !important; }`, particles: 'pongal' },
  "eid": { name: "Eid Mubarak", css: `body { background-color: #022c22 !important; color: #fef08a !important; } .bg-white { background-color: #064e3b !important; border-color: #fef08a !important; } .text-gray-900, .text-gray-800 { color: #fef08a !important; } .text-[#1557b0] { color: #fef08a !important; }`, particles: 'eid' },
  "newyear": { name: "Happy New Year", css: `body { background-color: #000 !important; color: #fbbf24 !important; } .bg-white { background-color: #111 !important; border: 1px solid #fbbf24 !important; } .text-gray-900, .text-gray-800 { color: #fbbf24 !important; }`, particles: 'newyear' },
  "matrix": { name: "Enter the Matrix", css: `body { background-color: #000 !important; font-family: "Courier New", monospace !important; color: #0f0 !important; } .bg-white { background-color: #000 !important; border: 1px solid #0f0 !important; } .text-gray-900, .text-gray-800 { color: #0f0 !important; } * { border-radius: 0 !important; }`, particles: 'matrix' }
};

export default function DailyThemeEngine() {
  const [theme, setTheme] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [, setKeySequence] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      setKeySequence(prev => {
        const newSeq = (prev + e.key).toLowerCase().slice(-15);
        
        let foundTheme = null;
        if (newSeq.endsWith('monday')) foundTheme = themes.Monday;
        else if (newSeq.endsWith('tuesday')) foundTheme = themes.Tuesday;
        else if (newSeq.endsWith('wednesday')) foundTheme = themes.Wednesday;
        else if (newSeq.endsWith('thursday')) foundTheme = themes.Thursday;
        else if (newSeq.endsWith('friday')) foundTheme = themes.Friday;
        else if (newSeq.endsWith('saturday')) foundTheme = themes.Saturday;
        else if (newSeq.endsWith('sunday')) foundTheme = themes.Sunday;
        else if (newSeq.endsWith('halloween')) foundTheme = specialEvents["halloween"];
        else if (newSeq.endsWith('christmas')) foundTheme = specialEvents["christmas"];
        else if (newSeq.endsWith('diwali')) foundTheme = specialEvents["diwali"];
        else if (newSeq.endsWith('navratri')) foundTheme = specialEvents["navratri"];
        else if (newSeq.endsWith('holi')) foundTheme = specialEvents["holi"];
        else if (newSeq.endsWith('pongal')) foundTheme = specialEvents["pongal"];
        else if (newSeq.endsWith('eid')) foundTheme = specialEvents["eid"];
        else if (newSeq.endsWith('newyear')) foundTheme = specialEvents["newyear"];
        else if (newSeq.endsWith('matrix')) foundTheme = specialEvents["matrix"];
        else if (newSeq.endsWith('default') || newSeq.endsWith('normal') || newSeq.endsWith('clear')) {
          setTheme(null);
          setIsVisible(false);
          return newSeq;
        }

        if (foundTheme) {
          setTheme(foundTheme);
          setIsVisible(true);
        }
        
        return newSeq;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!theme) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: theme.css }} />
      <ThemeParticles type={theme.particles} />
      
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-[9999] bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-2xl border border-gray-200 flex flex-col gap-2 sm:max-w-sm animate-fade-in-up">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-sm">✨ Secret Theme Unlocked: {theme.name}</span>
            <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <p className="text-xs text-gray-500">Type <strong className="text-gray-800 bg-gray-100 px-1 rounded">default</strong> anywhere on the screen to restore.</p>
        </div>
      )}
    </>
  );
}
