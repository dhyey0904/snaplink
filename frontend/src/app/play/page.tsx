import { Metadata } from 'next';
import SnapPlayApp from './SnapPlayApp';

export const metadata: Metadata = {
  title: 'SnapPlay | Daily Challenge',
  description: 'One daily challenge. 60 seconds. Can you beat the world? Play SnapPlay.',
};

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center font-sans text-white relative">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1a73e8] rounded-full blur-[150px] opacity-20 mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ff00ff] rounded-full blur-[150px] opacity-20 mix-blend-screen animate-pulse duration-7000 delay-1000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[480px] h-full flex flex-col p-4 sm:p-6 min-h-[100dvh]">
         <SnapPlayApp />
      </div>
    </main>
  );
}
