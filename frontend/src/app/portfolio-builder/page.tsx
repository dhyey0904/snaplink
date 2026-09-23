import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import SEOLandingLayout from '@/components/SEOLandingLayout';

export const metadata: Metadata = {
  title: "Portfolio Builder | SnapLink",
  description: "Create a stunning digital portfolio in minutes. Showcase your skills, projects, and resume with SnapLink's Bio Creator.",
  alternates: {
    canonical: "https://www.snaplinks.in/portfolio-builder",
  },
};

export default function Page() {
  return (
    <SEOLandingLayout 
      title="Free Digital Portfolio Builder"
      subtitle="Showcase your work, upload your resume, and link to your projects with a stunning, customizable digital portfolio."
      InteractiveWidget={
        
            <div className="flex flex-col gap-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" placeholder="Alex Designer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profession</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" placeholder="UI/UX Engineer" />
                </div>
              </div>
              <Link href="/register" className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md text-center mt-2">
                Generate My Portfolio
              </Link>
            </div>
        
      }
      contentTitle="The Fastest Way to Build a Professional Portfolio"
      content={
        <>
            <p>Hiring managers and potential clients don't have time to navigate complicated, slow-loading websites. They want to see who you are, what you do, and your best work immediately. SnapLink serves as an incredibly efficient <strong>Portfolio Builder</strong> by combining link aggregation with direct file hosting.</p>
            
            <h3>Upload Your Resume Directly</h3>
            <p>Don\'t force recruiters to dig through Google Drive links. SnapLink's bio creator allows you to upload your PDF resume directly to your profile. Visitors can view and download your resume with a single click, drastically improving your chances of getting hired.</p>
            
            <h3>Showcase Your Projects</h3>
            <p>Use customizable buttons and links to direct traffic to your GitHub repositories, Dribbble designs, Behance case studies, or personal websites. You can highlight your most important projects using "Featured" animations to grab attention immediately.</p>
            
            <h3>Beautiful Customization</h3>
            <p>Your portfolio should reflect your personal brand. Choose from modern themes like Glassmorphism, Neo-Brutalism, or Minimalist styling. Customize your colors, fonts, and profile imagery to ensure you stand out from the crowd.</p>
        </>
      }
      faqs={[
        { q: 'Can I host my portfolio on my own domain?', a: 'Currently, portfolios are hosted on our secure short domains (e.g., snaplinks.in/bio/yourname), making them incredibly easy to share on LinkedIn or Twitter.' }, { q: 'Is the portfolio mobile-friendly?', a: 'Absolutely. SnapLink portfolios are designed mobile-first, ensuring they look perfect and load instantly on any smartphone or tablet.' }, { q: 'Can I track who views my portfolio?', a: 'Yes! Our dashboard provides analytics so you can see how many times your portfolio was viewed and which specific projects or links were clicked the most.' }
      ]}
    />
  );
}
