import { Metadata } from 'next';
import SnapPlayApp from './SnapPlayApp';

export const metadata: Metadata = {
  title: 'SnapPlay | Daily Challenges & Mini-Games',
  description: 'Play a new addictive mini-game every single day on SnapPlay. Test your reflexes, speed math, and memory. Can you beat the world? Play SnapPlay completely free.',
  keywords: ["SnapPlay", "daily challenge", "mini-games", "brain training", "speed math", "reflex test", "daily games", "browser games", "wordle alternative"],
  alternates: {
    canonical: "/play",
  },
  openGraph: {
    title: 'SnapPlay | 365 Days of Mini-Games',
    description: 'A new daily challenge unlocks every midnight. Compete globally, test your brain, and build your streak on SnapPlay.',
    url: '/play',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SnapPlay Daily Challenges Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapPlay Daily Challenges',
    description: 'Play a new addictive mini-game every single day on SnapPlay. No downloads, completely free.',
    images: ['/og-image.png'],
  }
};

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center font-sans text-white relative">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1a73e8] rounded-full blur-[150px] opacity-20 mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ff00ff] rounded-full blur-[150px] opacity-20 mix-blend-screen animate-pulse duration-7000 delay-1000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[480px] h-full flex flex-col p-4 sm:p-4 md:p-6 min-h-[100dvh]">
         <SnapPlayApp />
      </div>
    </main>
  );
}
