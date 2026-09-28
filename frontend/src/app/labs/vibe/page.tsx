import { Metadata } from 'next';
import VibeApp from './VibeApp';

export const metadata: Metadata = {
  title: 'Internet Vibe ID™ by SnapLabs',
  description: 'Discover your true internet personality. A viral experience by SnapLinks.',
};

export default function VibePage() {
  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center font-sans text-white relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#1a73e8] rounded-full blur-[120px] opacity-30 mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-[#ff00ff] rounded-full blur-[120px] opacity-20 mix-blend-screen animate-pulse duration-7000 delay-1000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-[#00ffff] rounded-full blur-[120px] opacity-20 mix-blend-screen animate-pulse duration-8000 delay-2000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[450px] mx-auto min-h-[100dvh] flex flex-col">
         <VibeApp />
      </div>
    </main>
  );
}
