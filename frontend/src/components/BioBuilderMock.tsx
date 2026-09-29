"use client";
﻿import React, { useState } from 'react';
import Link from 'next/link';

export default function BioBuilderMock() {
  const [bioName, setBioName] = useState('Dhyey Raja');
  const [bioColor, setBioColor] = useState('bg-blue-600');

  return (
    <div className="flex flex-col lg:flex-row items-center gap-16">
      <div className="w-full lg:w-1/2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-base sm:text-sm font-bold text-blue-700 mb-6 uppercase tracking-wider">
          Link-in-Bio
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#202124] mb-6 leading-tight">
          Stop using boring generic bios.
        </h2>
        <p className="text-[#5f6368] text-xl mb-10 leading-relaxed">
          SnapLinks offers beautiful, animated, and fully customizable Biolink pages. Let your personality shine with mesh gradients, verified badges, and dynamic cards.
        </p>
        
        {/* Live Builder Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
            Live Customizer
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="bioNameInput" className="block text-base sm:text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input id="bioNameInput" type="text" value={bioName} onChange={e => setBioName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-600" />
            </div>
            <div>
              <label className="block text-base sm:text-sm font-medium text-gray-700 mb-2">Theme Color</label>
              <div className="flex gap-3">
                {['bg-blue-600', 'bg-purple-600', 'bg-pink-500', 'bg-green-500', 'bg-black'].map(color => (
                  <button
                      key={color}
                      aria-label={`Select ${color.replace("bg-", "").replace("-600", "").replace("-500", "")} theme`}
                      onClick={() => setBioColor(color)}
                      className={`w-8 h-8 rounded-full ${color} ${bioColor === color ? 'ring-4 ring-offset-2 ring-gray-300 transform scale-110' : ''} transition-all shadow-sm`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Link href="/register" className="inline-flex items-center gap-2 font-bold text-[#1a73e8] hover:text-blue-700 text-lg transition-colors">
          Create your free bio page 
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </Link>
      </div>

      {/* Phone Mockup */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
          
          <div className={`w-full h-full rounded-[2.5rem] ${bioColor} overflow-hidden relative flex flex-col items-center pt-16 px-4 transition-colors duration-500`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
            
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md p-1 mb-4 shadow-xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl overflow-hidden">
                👨‍💻 
              </div>
            </div>
            <div className="flex items-center gap-1 mb-1 relative z-10">
              <p className="text-xl font-bold text-white tracking-tight">{bioName}</p>
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <p className="text-white/80 text-base sm:text-sm mb-8 text-center relative z-10">Digital Creator & Designer</p>

            <div className="w-full space-y-3 relative z-10">
              {[1,2,3].map(i => (
                <div key={i} className="w-full py-3 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white font-medium hover:bg-white/20 transition-colors cursor-pointer shadow-sm">
                  {i === 1 ? 'My Portfolio' : i === 2 ? 'Latest Video' : 'Contact Me'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
