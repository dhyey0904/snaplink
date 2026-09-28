'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const DUCK_TYPES = [
  { id: 'classic', name: 'Classic Duck', emoji: '🦆', rarity: 'Normal' },
  { id: 'coffee', name: 'Coffee Duck', emoji: '☕', rarity: 'Normal' },
  { id: 'ghost', name: 'Ghost Duck', emoji: '👻', rarity: 'Rare' },
  { id: 'space', name: 'Space Duck', emoji: '🚀', rarity: 'Rare' },
  { id: 'crystal', name: 'Crystal Duck', emoji: '💎', rarity: 'Epic' },
  { id: 'matrix', name: 'Matrix Duck', emoji: '🟩', rarity: 'Epic' },
  { id: 'legendary', name: 'Crown Duck', emoji: '👑', rarity: 'Legendary' },
  { id: 'golden', name: 'Golden Duck', emoji: '🏆', rarity: 'Golden' },
];

export default function DuckCollectionPage() {
  const [collection, setCollection] = useState<{date: string, duckId: string}[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storage = localStorage.getItem('snapduck_collection');
    if (storage) {
      try {
        setCollection(JSON.parse(storage));
      } catch (e) {}
    }
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Duck Collection</h1>
            <p className="text-gray-500 mt-2">Find the hidden SnapDuck every day to grow your collection.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-center">
              <span className="block text-2xl font-black text-[#1a73e8]">{collection.length}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Found</span>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <span className="block text-2xl font-black text-purple-600">
                {collection.filter(c => DUCK_TYPES.find(d => d.id === c.duckId)?.rarity !== 'Normal').length}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Rare+</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {DUCK_TYPES.map(duck => {
            const foundData = collection.find(c => c.duckId === duck.id);
            const isFound = !!foundData;

            return (
              <div 
                key={duck.id}
                className={`relative aspect-square rounded-3xl p-6 flex flex-col items-center justify-center transition-all ${
                  isFound 
                  ? 'bg-white shadow-xl hover:scale-105 border border-gray-100 cursor-pointer' 
                  : 'bg-gray-100 border border-gray-200 opacity-50 filter grayscale'
                }`}
              >
                <div className="text-5xl mb-4 filter drop-shadow-md">
                  {isFound ? duck.emoji : '❓'}
                </div>
                <h3 className="font-bold text-gray-900 text-center text-sm mb-1">{isFound ? duck.name : 'Unknown Duck'}</h3>
                
                {isFound && (
                  <>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-2">{duck.rarity}</span>
                    <span className="text-[10px] text-gray-400">{new Date(foundData.date).toLocaleDateString()}</span>
                  </>
                )}
                
                {!isFound && (
                  <span className="text-xs font-medium text-gray-500">Locked</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="text-[#1a73e8] font-bold hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
