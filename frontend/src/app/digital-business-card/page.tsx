import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import SEOLandingLayout from '@/components/SEOLandingLayout';

export const metadata: Metadata = {
  title: "3D Digital Business Card | SnapLink",
  description: "Create a stunning, interactive 3D digital business card. The ultimate modern alternative to paper and NFC cards.",
  alternates: {
    canonical: "https://www.snaplinks.in/digital-business-card",
  },
};

export default function Page() {
  return (
    <SEOLandingLayout 
      title="Interactive 3D Digital Business Card"
      subtitle="Ditch paper cards forever. Generate a stunning, interactive 3D digital business card that houses all your contact info and links."
      InteractiveWidget={
        
            <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20"></div>
              <div className="w-48 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all duration-500 flex flex-col justify-between p-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                <div>
                  <div className="w-24 h-2 bg-white/40 rounded-full mb-1"></div>
                  <div className="w-16 h-2 bg-white/20 rounded-full"></div>
                </div>
              </div>
              <Link href="/register" className="mt-8 relative z-10 bg-white text-gray-900 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
                Create Your 3D Card
              </Link>
            </div>
        
      }
      contentTitle="The Modern Alternative to Paper and NFC Cards"
      content={
        <>
            <p>Networking has evolved, but the way we share contact information hasn\'t. Paper business cards get thrown away, and expensive physical NFC cards get lost. SnapLink introduces the ultimate solution: a fully hosted, interactive <strong>3D Digital Business Card</strong>.</p>
            
            <h3>A Premium Interactive Experience</h3>
            <p>When you share your SnapLink profile, visitors don't just see a flat webpage. They are greeted with a stunning 3D rendering of a business card that reacts to their mouse movements and gyroscope (on mobile). This level of polish instantly elevates your personal brand and leaves a lasting impression on potential clients and partners.</p>
            
            <h3>Everything in One Place</h3>
            <p>Your digital business card houses much more than just your phone number. It serves as a central hub for your email, LinkedIn, Twitter, company website, and even downloadable files like your resume or media kit. It is the ultimate networking tool for modern professionals.</p>
            
            <h3>Instantly Shareable via QR</h3>
            <p>You never have to worry about carrying physical cards again. Simply open your SnapLink dashboard on your phone and display your unique QR code. Anyone you meet at a conference or networking event can simply point their camera at your phone and instantly access your 3D digital card.</p>
        </>
      }
      faqs={[
        { q: 'Do I need to buy a physical NFC card to use this?', a: 'No! SnapLink digital business cards are entirely software-based. You can share them instantly via a URL link, a QR code, or by adding the link to your social media bios.' }, { q: 'Can people save my contact info to their phone?', a: 'Yes, you can easily link a downloadable vCard (.vcf) file to your SnapLink profile, allowing visitors to save your phone number and email directly to their contacts app with one tap.' }, { q: 'Is the 3D effect supported on all phones?', a: 'The 3D interactive effect utilizes modern WebGL and CSS transforms, which are fully supported on virtually all modern iOS and Android smartphones.' }
      ]}
    />
  );
}
