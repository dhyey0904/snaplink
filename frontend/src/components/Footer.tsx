import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-500 font-sans mt-auto relative z-10">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        
        {/* Top Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Product */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 tracking-wide text-sm">PRODUCT</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-[#1a73e8] transition-colors">Home</Link></li>
              <li><Link href="/pricing" className="hover:text-[#1a73e8] transition-colors">Pricing</Link></li>
              <li><Link href="/tools" className="hover:text-[#1a73e8] transition-colors">Tools</Link></li>
              <li><Link href="/help" className="hover:text-[#1a73e8] transition-colors">FAQ</Link></li>
              <li><Link href="/dashboard/api" className="hover:text-[#1a73e8] transition-colors">Developers API</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 tracking-wide text-sm">RESOURCES</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/url-shortener" className="hover:text-[#1a73e8] transition-colors">URL Shortener</Link></li>
              <li><Link href="/linktree-alternative" className="hover:text-[#1a73e8] transition-colors">Link-in-Bio</Link></li>
              <li><Link href="/file-sharing" className="hover:text-[#1a73e8] transition-colors">File Sharing</Link></li>
              <li><Link href="/digital-business-card" className="hover:text-[#1a73e8] transition-colors">3D vCard</Link></li>
              <li><Link href="/blog" className="hover:text-[#1a73e8] transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 tracking-wide text-sm">LEGAL</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/security" className="hover:text-[#1a73e8] transition-colors">Security</Link></li>
              <li><Link href="/privacy" className="hover:text-[#1a73e8] transition-colors">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#1a73e8] transition-colors">Terms & conditions</Link></li>
              <li><Link href="/report" className="hover:text-[#1a73e8] transition-colors">Report Abuse</Link></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 tracking-wide text-sm">COMPANY</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-[#1a73e8] transition-colors">About us</Link></li>
              <li><Link href="/contact" className="hover:text-[#1a73e8] transition-colors">Contact us</Link></li>
              <li>
                <div className="inline-flex items-center gap-2 group cursor-pointer" title="All systems are operating normally">
                  System Status
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Separator, Language, Social, Copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col items-center justify-center gap-6 text-sm">
          
          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a href="https://github.com/dhyey0904" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a73e8] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/dhyey-raja-b7870a321/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a73e8] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://www.instagram.com/snaplink_2026/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a73e8] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-center flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span>&copy; {new Date().getFullYear()} SnapLink - Your Digital Workspace</span>
            <span className="hidden md:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>Designed by <a href="https://github.com/dhyey0904" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 hover:text-[#1a73e8] transition-colors">Dhyey Raja</a></span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
