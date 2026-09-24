import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | SnapLink",
  description: "Read the Terms of Service for SnapLink. These terms govern your use of our URL shortener, file sharing, and digital vCard services.",
  alternates: {
    canonical: "https://www.snaplinks.in/terms",
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-500">Effective Date: September 23, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-blue max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:leading-relaxed prose-li:leading-relaxed">
          
          <p>
            Welcome to SnapLink ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of 
            the SnapLink website (www.snaplinks.in) and our suite of digital tools, including our URL shortener, ephemeral 
            file sharing service, digital business cards, and Developer API (collectively, the "Services").
          </p>
          <p>
            <strong>Please read these Terms carefully. By accessing or using the Services, you agree to be bound by these Terms. 
            If you do not agree to all the terms and conditions, you may not access the Services.</strong>
          </p>

          <h2>1. Description of Services</h2>
          <p>SnapLink provides a unified digital workspace that allows users to create shortened URLs, host digital bio pages (vCards), and securely transfer large files. The Services are provided "as is," and we reserve the right to modify, suspend, or discontinue any feature at any time without prior notice.</p>

          <h2>2. User Accounts & Security</h2>
          <p>To access certain features, you must create a SnapLink account. You are strictly responsible for maintaining the confidentiality of your account credentials (including passwords) and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to protect your login information.</p>

          <h2>3. Acceptable Use Policy (AUP)</h2>
          <p>You agree not to misuse the SnapLink Services. Specifically, you shall <strong>not</strong> use our platform to:</p>
          <ul>
            <li>Upload, share, or distribute malware, viruses, trojans, or any malicious code.</li>
            <li>Host phishing websites, scams, or fraudulent links.</li>
            <li>Distribute illegal, copyrighted, sexually explicit, or highly regulated content without authorization.</li>
            <li>Send unsolicited spam messages, bulk emails, or SMS campaigns containing SnapLink URLs.</li>
            <li>Attempt to reverse-engineer the platform, bypass security mechanisms, or scrape data.</li>
          </ul>
          <p><em>We employ automated threat-detection systems. We reserve the right to instantly terminate accounts, delete files, and disable links that violate this Acceptable Use Policy without prior warning.</em></p>

          <h2>4. Ephemeral File Storage & Data Loss</h2>
          <p>SnapLink is designed for <strong>ephemeral (temporary) data transfer</strong>, not permanent cloud storage. Files uploaded to our platform are designed to self-destruct based on your configuration (e.g., after 24 hours or after a specific number of downloads).</p>
          <p><strong>Disclaimer:</strong> You understand that files will be permanently and irreversibly deleted once they expire. We are not responsible or liable for the deletion, failure to store, or loss of any files or content uploaded to the Service. Always keep backups of your important data.</p>

          <h2>5. Payments and Subscriptions</h2>
          <p>Certain features (such as Developer API limits or premium themes) may require payment. All payments are securely processed by Razorpay. By upgrading to a paid tier, you agree to pay the fees specified at checkout. Subscriptions will automatically renew unless canceled prior to the billing cycle date. All fees are non-refundable unless otherwise required by law.</p>

          <h2>6. Developer API & Rate Limiting</h2>
          <p>If you utilize the SnapLink Developer API, you must strictly adhere to the rate limits specified in your tier. Attempting to circumvent these rate limits, sharing API keys publicly, or generating excessive load on our infrastructure will result in an immediate API ban.</p>

          <h2>7. Intellectual Property</h2>
          <p>All intellectual property rights in the Services, including but not limited to the underlying source code, design, branding, and algorithms, are owned by SnapLink. You are granted a limited, non-exclusive, non-transferable license to use the Services. You do not acquire any ownership rights by using the platform.</p>

          <h2>8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, SnapLink and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your access to or use of (or inability to access or use) the Services.</p>

          <h2>9. Termination</h2>
          <p>We reserve the right to suspend or terminate your account and access to the Services at our sole discretion, without notice or liability, for any reason, including but not limited to a breach of these Terms.</p>

          <h2>10. Contact Information</h2>
          <p>If you have any questions, concerns, or legal inquiries regarding these Terms of Service, please contact us at:</p>
          <p className="font-bold text-gray-900">legal@snaplinks.in</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
