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

          {/* Copyright */}
          <div className="text-gray-500 text-center flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span>&copy; {new Date().getFullYear()} SnapLinks - Your Digital Workspace</span>
            <span className="hidden md:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>Designed by <a href="https://github.com/dhyey0904" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 hover:text-[#1a73e8] transition-colors">Dhyey Raja</a></span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
