import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Help Center & FAQ | SnapLink",
  description: "Find answers to frequently asked questions, learn how to use SnapLink, and contact support.",
  alternates: {
    canonical: "https://www.snaplinks.in/help",
  },
};

export default function HelpCenterPage() {
  const faqs = [
    {
      category: "File Sharing",
      questions: [
        { q: "How large of a file can I send?", a: "Currently, you can securely upload and share files up to 50MB in size. We enforce this limit to ensure lightning-fast global transfers and guaranteed uptime on our free tier." },
        { q: "What happens when a file expires?", a: "When a file reaches its self-destruct timer or download limit, it is permanently and irreversibly deleted from our servers. The link will remain active but will display a 'File Expired' message." },
        { q: "Do people need an account to download my files?", a: "No, recipients do not need a SnapLink account to download files. They simply click your link and enter the password (if you set one)." }
      ]
    },
    {
      category: "URL Shortener & Links",
      questions: [
        { q: "Can I customize my shortened link?", a: "Yes! When generating a link, you can provide a custom alias (e.g., snaplinks.in/your-brand) to make your link memorable." },
        { q: "What analytics do you track?", a: "We track total clicks, geographic location of the clicks, device types, browser types, and referring websites to help you measure the success of your links." },
        { q: "Can I change the destination of a shortened link?", a: "Yes, all links generated through your dashboard are dynamic. You can edit the destination URL at any time without having to generate or share a new short link." }
      ]
    },
    {
      category: "Digital vCards",
      questions: [
        { q: "What is a 3D Digital vCard?", a: "It is an interactive, modern alternative to a paper business card. It acts as a central hub for all your social links, email, phone number, and downloadable assets (like resumes)." },
        { q: "How do I share my vCard?", a: "You can share it by placing the link in your social media bios, sending it via text, or letting someone scan the unique QR code provided in your dashboard." }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        { q: "Is my data secure?", a: "Absolutely. All transfers are protected by industry-standard TLS encryption. We do not inspect or sell your data." },
        { q: "How do I reset my password?", a: "If you forgot your password, simply click 'Forgot Password' on the login screen. If you signed up using Google Authentication, you must manage your password directly through Google." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      <Navbar />
      
      <main className="flex-1 w-full pt-32 pb-24">
        
        {/* Header */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Search for answers..." 
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqs.map((section, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#1a73e8] rounded-full"></div>
                  {section.category}
                </h2>
                
                <div className="space-y-6">
                  {section.questions.map((faq, fIdx) => (
                    <div key={fIdx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <div className="bg-[#1a73e8] rounded-3xl p-10 shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              If you couldn't find the answer to your question in our FAQ, our support team is ready to assist you.
            </p>
            <a href="mailto:support@snaplinks.in" className="inline-block bg-white text-[#1a73e8] px-8 py-3 rounded-xl font-bold shadow hover:bg-gray-50 transition-colors">
              Contact Support
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
