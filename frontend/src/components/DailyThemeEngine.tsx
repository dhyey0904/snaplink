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
    particles: 'matrix',
    isTemporary: false
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
    particles: 'leaves',
    isTemporary: false
  },
  Wednesday: {
    name: "Mystery Wednesday",
    css: `
      body { filter: invert(0.8) hue-rotate(90deg); background-color: #111 !important; }
    `,
    particles: 'none',
    isTemporary: false
  },
  Thursday: {
    name: "Retro Thursday",
    css: `
      body { font-family: "Courier New", monospace !important; background-color: #222 !important; }
      .bg-white { background-color: #ccc !important; border: 4px solid #fff !important; }
      * { border-radius: 0 !important; }
    `,
    particles: 'pixels',
    isTemporary: false
  },
  Friday: {
    name: "Party Friday",
    css: `
      body { background: linear-gradient(45deg, #ff00ff, #00ffff) !important; }
      .bg-white { background-color: rgba(255,255,255,0.8) !important; backdrop-filter: blur(10px); }
    `,
    particles: 'confetti',
    isTemporary: false
  },
  Saturday: {
    name: "Galaxy Saturday",
    css: `
      body { background-color: #090a0f !important; color: #fff !important; }
      .bg-white, .bg-gray-50 { background-color: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; }
      .text-gray-900, .text-gray-800, .text-gray-700 { color: #fff !important; }
      .text-gray-600, .text-gray-500, .text-gray-400 { color: #ccc !important; }
    `,
    particles: 'stars',
    isTemporary: false
  },
  Sunday: {
    name: "Minimal Sunday",
    css: `
      body { background-color: #fafafa !important; filter: grayscale(100%); }
    `,
    particles: 'none',
    isTemporary: false
  }
};

// Festivals now ONLY trigger temporary particles and text, NO CSS overrides!
const specialEvents: Record<string, {name: string, css: string, particles: string, isTemporary: boolean}> = {
  "halloween": { name: "Halloween", css: ``, particles: 'halloween', isTemporary: true },
  "christmas": { name: "Christmas", css: ``, particles: 'christmas', isTemporary: true },
  "diwali": { name: "Happy Diwali", css: ``, particles: 'diwali', isTemporary: true },
  "navratri": { name: "Happy Navratri", css: ``, particles: 'navratri', isTemporary: true },
  "holi": { name: "Happy Holi", css: ``, particles: 'holi', isTemporary: true },
  "pongal": { name: "Happy Pongal", css: ``, particles: 'pongal', isTemporary: true },
  "eid": { name: "Eid Mubarak", css: ``, particles: 'eid', isTemporary: true },
  "newyear": { name: "Happy New Year", css: ``, particles: 'newyear', isTemporary: true },
  "matrix": { name: "Enter the Matrix", css: ``, particles: 'matrix_temp', isTemporary: true }
};

export default function DailyThemeEngine() {
  const [theme, setTheme] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [, setKeySequence] = useState("");

  // Automatically clear temporary themes after 10 seconds
  useEffect(() => {
    if (theme && theme.isTemporary) {
      const timer = setTimeout(() => {
        setTheme(null);
      }, 10000); // 10 seconds total
      return () => clearTimeout(timer);
    }
  }, [theme]);

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
          // Only show the banner for permanent themes
          if (!foundTheme.isTemporary) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
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
      {theme.css && <style dangerouslySetInnerHTML={{ __html: theme.css }} />}
      
      <ThemeParticles type={theme.particles} />
      
      {isVisible && !theme.isTemporary && (
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
