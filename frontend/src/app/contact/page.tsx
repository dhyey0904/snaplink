import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | SnapLinks",
  description: "Get in touch with the SnapLinks team for support, business inquiries, or general questions.",
  alternates: {
    canonical: "https://www.snaplinks.in/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      <Navbar />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Get in <span className="text-[#1a73e8]">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question about SnapLinks, need technical support, or want to explore a partnership? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Contact Information Cards */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-[#1a73e8] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">For all technical support, billing inquiries, and general questions.</p>
              <a href="mailto:hello.snaplinks@gmail.com" className="text-[#1a73e8] font-bold hover:underline">hello.snaplinks@gmail.com</a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Professionally</h3>
              <p className="text-gray-600 mb-4">Connect with the founder and lead engineer on LinkedIn.</p>
              <a href="https://www.linkedin.com/in/dhyey-raja-b7870a321/" target="_blank" rel="noopener noreferrer" className="text-gray-700 font-bold hover:text-[#1a73e8] transition-colors flex items-center gap-2">
                LinkedIn Profile <span className="text-xl">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Social / Developer Links */}
          <div className="bg-gray-900 text-white p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#1a73e8] rounded-full opacity-20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Open Source & Development</h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Interested in our developer APIs, open source contributions, or exploring the architecture behind SnapLinks? Let's build together.
              </p>
              
              <div className="space-y-4">
                <a href="https://github.com/dhyey0904" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl border border-white/10">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <div>
                    <div className="font-bold">Follow on GitHub</div>
                    <div className="text-sm text-gray-400">@dhyey0904</div>
                  </div>
                </a>
                
                <a href="https://www.instagram.com/snaplinks_2026/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl border border-white/10">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <div>
                    <div className="font-bold">Follow on Instagram</div>
                    <div className="text-sm text-gray-400">@snaplinks_2026</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
