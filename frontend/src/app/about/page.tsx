import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | SnapLinks",
  description: "Learn about SnapLinks's mission to unify digital identity, secure file sharing, and link management for modern professionals.",
  alternates: {
    canonical: "https://www.snaplinks.in/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      <Navbar />
      
      <main className="flex-1 w-full pt-32 pb-24">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Simplifying the <span className="text-[#1a73e8]">Digital World</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SnapLinks is the ultimate unified workspace for creators, developers, and professionals. 
            We are building the internet's most powerful tools for digital identity and data transfer.
          </p>
        </section>

        {/* Story Section */}
        <section className="bg-white py-20 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg prose-blue max-w-none text-gray-600 text-justify text-center mx-auto">
              <p>
                The internet is fragmented. Modern professionals are forced to juggle expensive subscriptions 
                across half a dozen platforms just to share large files, shorten URLs, and host a digital business card. 
              </p>
              <p>
                We built SnapLinks because we believed there had to be a better way. We envisioned a single, 
                unified platform that combined high-quality ephemeral file sharing with deep link analytics 
                and stunning 3D digital profiles. Today, SnapLinks empowers our users to take back 
                control of their digital footprint—seamlessly, powerfully, and affordably.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-blue-50 text-[#1a73e8] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy by Design</h3>
              <p className="text-gray-600">We believe your data belongs to you. From self-destructing files to password-protected links, security is baked into our DNA.</p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Performance is a feature. Our cloud hosting ensures your files upload instantly and your links route without delay.</p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Beautiful Simplicity</h3>
              <p className="text-gray-600">Software doesn't have to be ugly. We obsess over clean UI, intuitive user experiences, and frictionless design.</p>
            </div>
          </div>
        </section>

        {/* The Team / Founder Section */}
        <section className="bg-gray-900 py-20 text-white mt-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold mb-8">Designed & Engineered by Dhyey</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              SnapLinks is proudly built by Dhyey with a relentless focus on high-quality reliability, 
              pixel-perfect UI, and developer-first APIs. We are driven by the passion to build tools 
              that actually make your daily workflow easier.
            </p>
            <a href="https://github.com/dhyey0904" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors mb-12">
              Follow on GitHub
            </a>
            
            <div className="pt-10 border-t border-gray-800 text-sm text-gray-500 max-w-3xl mx-auto">
              <p><strong>Legal Disclaimer:</strong> SnapLinks is currently operating as an independent, unregistered project and is not a registered corporate entity. The platform and all services are provided "as-is" without any warranties. The creators and developers hold no legal liability for data loss, service interruptions, or any damages arising from the use of this website. You use SnapLinks entirely at your own risk.</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
