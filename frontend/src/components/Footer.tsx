import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1c1c24] text-gray-300 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Top Section: Links & App Stores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Column 1: Product */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">PRODUCT</h3>
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
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">RESOURCES</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/url-shortener" className="hover:text-[#1a73e8] transition-colors">URL Shortener</Link></li>
              <li><Link href="/linktree-alternative" className="hover:text-[#1a73e8] transition-colors">Link-in-Bio</Link></li>
              <li><Link href="/file-sharing" className="hover:text-[#1a73e8] transition-colors">File Sharing</Link></li>
              <li><Link href="/digital-business-card" className="hover:text-[#1a73e8] transition-colors">3D vCard</Link></li>
              <li><Link href="/blog" className="hover:text-[#1a73e8] transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">SOLUTIONS</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/business" className="hover:text-[#1a73e8] transition-colors">Business</Link></li>
              <li><Link href="/creators" className="hover:text-[#1a73e8] transition-colors">Creators</Link></li>
              <li><Link href="/education" className="hover:text-[#1a73e8] transition-colors">Education</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">LEGAL</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/security" className="hover:text-[#1a73e8] transition-colors">Security</Link></li>
              <li><Link href="/privacy" className="hover:text-[#1a73e8] transition-colors">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#1a73e8] transition-colors">Terms & conditions</Link></li>
              <li><Link href="/report" className="hover:text-[#1a73e8] transition-colors">Report Abuse</Link></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">COMPANY</h3>
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

          {/* Column 6: App Stores (Hidden on smaller screens to prevent overflow, like iLovePDF) */}
          <div className="hidden lg:flex flex-col gap-3">
            <a href="#" className="border border-gray-600 rounded-lg p-2 flex items-center gap-3 hover:bg-gray-800 transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.3414C17.523 15.3414 16.208 18.0674 14.887 20.3014C14.17 21.5124 13.565 22.8984 12.102 22.9234C10.686 22.9484 10.222 22.0624 8.653 22.0624C7.054 22.0624 6.516 22.9484 5.228 22.8984C3.89 22.8484 3.123 21.2824 2.457 20.1474C1.037 17.7474 0 14.3924 0 11.5834C0 7.8484 2.298 5.7664 4.882 5.7164C6.273 5.6914 7.424 6.6744 8.272 6.6744C9.117 6.6744 10.518 5.5394 12.181 5.6154C13.064 5.6404 14.73 5.9684 15.82 7.5614C15.727 7.6114 13.504 8.9024 13.504 11.4584C13.504 14.4374 16.141 15.4214 16.236 15.4714C16.183 15.5894 17.523 15.3414 17.523 15.3414ZM12.015 3.7904C12.785 2.8564 13.278 1.5454 13.136 0.234375C11.979 0.284375 10.589 1.0174 9.789 1.9514C9.102 2.7334 8.513 4.0954 8.683 5.3784C9.972 5.4794 11.246 4.7234 12.015 3.7904Z"/></svg>
              <div>
                <div className="text-[9px] uppercase leading-none text-gray-400">Download on the</div>
                <div className="text-sm font-semibold text-white leading-tight">App Store</div>
              </div>
            </a>
            
            <a href="#" className="border border-gray-600 rounded-lg p-2 flex items-center gap-3 hover:bg-gray-800 transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.609 22.186c-.161.16-.368.24-.593.24a.837.837 0 0 1-.84-.84c0-.225.08-.432.24-.593l9.59-9.593L2.416 1.814A.837.837 0 0 1 1.576.974c0-.225.08-.432.24-.593C1.976.22 2.183.14 2.408.14c.225 0 .432.08.593.24l.608.608v.826zm16.782.608c.16.161.24.368.24.593v17.97c0 .225-.08.432-.24.593l-.608.608-10.183-10.183L19.783 1.814l.608.608z" opacity="0"/><path d="M17.521 15.347L13.805 12l3.716-3.347 4.148 2.215a.86.86 0 0 1 .458.745v.774a.86.86 0 0 1-.458.745l-4.148 2.215zM2.416 1.814L13.197 11.45 2.416 22.186a.837.837 0 0 1-1.186-1.186L11.414 12 1.23 1.814a.837.837 0 0 1 1.186-1.186z"/></svg>
              <div>
                <div className="text-[9px] uppercase leading-none text-gray-400">GET IT ON</div>
                <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Section: Separator, Language, Social, Copyright */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          
          {/* Language Selector */}
          <div className="flex items-center gap-2 border border-gray-600 rounded px-3 py-1.5 cursor-pointer hover:bg-gray-800 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            <span>English</span>
            <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a href="https://twitter.com/snaplinks" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-400">
            &copy; {new Date().getFullYear()} SnapLink &reg; - Your Digital Workspace
          </div>
        </div>
        
      </div>
    </footer>
  );
}
