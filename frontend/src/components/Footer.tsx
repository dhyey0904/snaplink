import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-[#dadce0] pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Multi-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Mission */}
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-black tracking-tight text-[#202124]">
              Snap<span className="text-[#1a73e8]">Link</span>
            </span>
            <p className="text-[#5f6368] text-sm leading-relaxed">
              The unified workspace for creators and professionals.
            </p>
            <div className="flex gap-4 mt-2">
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a73e8] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a73e8] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              {/* Twitter/X */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a73e8] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/dashboard/links" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">URL Shortener</Link></li>
              <li><Link href="/dashboard/bio" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Link-in-Bio Pages</Link></li>
              <li><Link href="/dashboard/vcard" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">3D Business Cards</Link></li>
              <li><Link href="/dashboard/files" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Secure File Transfer</Link></li>
              <li><Link href="/dashboard/api" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Developer API</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Blog & Tutorials</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Help Center / FAQ</Link></li>
              <li><Link href="/dashboard/api" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">API Documentation</Link></li>
              <li>
                <div className="inline-flex items-center gap-2 text-gray-500 text-sm group cursor-pointer" title="All systems are operating normally">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  System Status: All Operational
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Company */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">About Us</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/report" className="text-gray-500 hover:text-[#1a73e8] transition-colors text-sm">Report Abuse</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 border-t border-gray-200 flex flex-col items-center gap-4">
          {/* Copyright & Portfolio Link */}
          <div className="text-center flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} SnapLink. All rights reserved.</p>
            <span className="hidden sm:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
            <p>
              Designed & Engineered by <a href="https://github.com/dhyey" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 hover:text-[#1a73e8] transition-colors">Dhyey Raja</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
