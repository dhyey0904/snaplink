import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import SEOLandingLayout from '@/components/SEOLandingLayout';

export const metadata: Metadata = {
  title: "Free URL Shortener | SnapLink",
  description: "Shorten long, ugly links into clean, trackable URLs. Features password protection, expiry dates, and advanced analytics.",
  alternates: {
    canonical: "https://www.snaplinks.in/url-shortener",
  },
};

export default function Page() {
  return (
    <SEOLandingLayout 
      title="The Ultimate Free URL Shortener"
      subtitle="Transform long, complicated links into clean, memorable URLs. Track clicks, protect with passwords, and set expiration dates."
      InteractiveWidget={
        
            <div className="flex flex-col md:flex-row gap-4">
              <input type="url" className="flex-1 px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none text-gray-900 placeholder-gray-500 text-lg" placeholder="Paste your very long URL here..." />
              <Link href="/register" className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md flex-shrink-0 flex items-center justify-center text-lg">
                Shorten Link
              </Link>
            </div>
        
      }
      contentTitle="Why You Need a Professional URL Shortener"
      content={
        <>
            <p>Long, messy URLs are difficult to read, impossible to remember, and look untrustworthy when shared on social media or in emails. SnapLink's <strong>Free URL Shortener</strong> solves this by condensing massive web addresses into sleek, secure, and highly trackable short links.</p>
            
            <h3>Custom Aliases</h3>
            <p>Don\'t settle for random strings of characters. SnapLink allows you to claim <strong>custom aliases</strong> (e.g., snaplinks.in/my-brand), making your links memorable and instantly recognizable to your audience. This drastically increases click-through rates on social media platforms.</p>
            
            <h3>Advanced Security: Passwords & Expiry</h3>
            <p>We believe a URL shortener should offer more than just aesthetics. If you are sharing a link to a sensitive Google Drive folder, a private Zoom meeting, or an exclusive product launch, you can lock your short link with a <strong>password</strong>. Furthermore, you can set an <strong>expiration date</strong>, ensuring the link automatically self-destructs and stops redirecting traffic after a specific time.</p>
            
            <h3>Real-Time Analytics</h3>
            <p>Knowledge is power. Every link you shorten with SnapLink acts as a powerful tracking pixel. Access your dashboard to view real-time click analytics, including traffic sources, browser types, and operating systems. Perfect for A/B testing and marketing campaigns.</p>
        </>
      }
      faqs={[
        { q: 'Can I customize the end of the short link?', a: 'Yes! When you create an account, you can type in a custom alias for your link instead of using a randomly generated one.' }, { q: 'Is there a limit to how many links I can shorten?', a: 'SnapLink offers generous free limits that are more than enough for individual professionals, creators, and small businesses.' }, { q: 'Can I update the destination URL later?', a: 'Yes, all links generated through your dashboard are dynamic, meaning you can edit the final destination URL at any time without having to generate a new short link.' }
      ]}
    />
  );
}
