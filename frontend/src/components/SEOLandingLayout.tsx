import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

interface FAQ {
  q: string;
  a: string;
}

interface SEOLandingLayoutProps {
  title: string;
  subtitle: string;
  InteractiveWidget: React.ReactNode;
  contentTitle: string;
  content: React.ReactNode;
  faqs: FAQ[];
}

export default function SEOLandingLayout({ title, subtitle, InteractiveWidget, contentTitle, content, faqs }: SEOLandingLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">{title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">{subtitle}</p>
          
          {/* Mock Interactive Widget (Intent-Driven) */}
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            {InteractiveWidget}
          </div>
        </div>

        {/* SEO Content Section (800+ words) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg prose-blue max-w-none text-gray-600">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">{contentTitle}</h2>
            {content}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of professionals using SnapLink today.</p>
          <Link href="/register" className="inline-block bg-[#1a73e8] hover:bg-[#1557b0] text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Create Your Free Account
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
