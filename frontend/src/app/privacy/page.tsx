import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | SnapLink",
  description: "Learn how SnapLink collects, uses, and protects your data. We are committed to your privacy and secure file sharing.",
  alternates: {
    canonical: "https://www.snaplinks.in/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-500">Effective Date: September 23, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-blue max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:leading-relaxed prose-li:leading-relaxed">
          
          <p>
            At SnapLink ("we," "us," or "our"), we are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
            (www.snaplinks.in) and use our suite of services, including our URL shortener, ephemeral file sharing, and 3D digital vCards.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use.</p>
          <ul>
            <li><strong>Personal Information Provided by You:</strong> We collect names, email addresses, passwords, and contact preferences.</li>
            <li><strong>Payment Data:</strong> If you make purchases, we collect data necessary to process your payment through our payment processor (Razorpay). We do not store your credit card numbers.</li>
            <li><strong>Usage Data:</strong> We automatically collect information regarding your interactions with our Services, such as IP addresses, browser types, operating systems, and the date/time of your visits.</li>
          </ul>

          <h2>2. How We Handle Your Files (Ephemeral Storage)</h2>
          <p>SnapLink is built on the principle of secure, temporary data transfer. When you upload a file using our Secure File Sharing feature:</p>
          <ul>
            <li><strong>Encryption:</strong> Files are encrypted in transit using industry-standard TLS encryption.</li>
            <li><strong>No Content Inspection:</strong> We do not actively monitor, read, or monetize the contents of the files you upload, unless explicitly required by law enforcement.</li>
            <li><strong>Automatic Deletion:</strong> Files are stored ephemerally. Once a file reaches its user-defined expiration limit (e.g., 24 hours, or immediately after download), it is permanently and irreversibly purged from our servers.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use personal information collected via our Services for a variety of business purposes described below:</p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To fulfill and manage your orders, payments, and subscriptions.</li>
            <li>To send administrative information to you, such as product updates or changes to our terms.</li>
            <li>To protect our Services (e.g., fraud monitoring and prevention).</li>
            <li>To provide advanced link analytics and performance metrics to you within your dashboard.</li>
          </ul>

          <h2>4. Will Your Information Be Shared With Anyone?</h2>
          <p>We only share and disclose your information in the following situations:</p>
          <ul>
            <li><strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
            <li><strong>Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (e.g., payment processing via Razorpay, database hosting via Supabase).</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
          </ul>
          <p><strong>We do not sell your personal data to data brokers or third-party advertising networks.</strong></p>

          <h2>5. Cookies and Similar Technologies</h2>
          <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>

          <h2>6. Your Privacy Rights (GDPR & CCPA)</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including the right to:</p>
          <ul>
            <li>Request access and obtain a copy of your personal information.</li>
            <li>Request rectification or erasure of your personal information.</li>
            <li>Restrict the processing of your personal information.</li>
            <li>If applicable, to data portability.</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the information provided below. We will consider and act upon any request in accordance with applicable data protection laws.</p>

          <h2>7. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, you may email us at:</p>
          <p className="font-bold text-gray-900">privacy@snaplinks.in</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
