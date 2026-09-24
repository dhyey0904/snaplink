import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import SEOLandingLayout from '@/components/SEOLandingLayout';

export const metadata: Metadata = {
  title: "Secure File Sharing | SnapLink",
  description: "Share files up to 50MB securely with auto-destructing links and password protection. The ultimate ephemeral file transfer tool.",
  alternates: {
    canonical: "https://www.snaplinks.in/file-sharing",
  },
};

export default function Page() {
  return (
    <SEOLandingLayout 
      title="Secure Ephemeral File Sharing"
      subtitle="Send files up to 50MB with military-grade privacy. Your files self-destruct after being downloaded, leaving no trace behind."
      InteractiveWidget={
        
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative overflow-hidden">
              <Link href="/register" className="absolute inset-0 z-10"></Link>
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-[#1a73e8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Drag and drop your files here</h3>
              <p className="text-gray-500">Up to 50MB. Files self-destruct automatically.</p>
              <div className="mt-6 inline-block bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold shadow-sm">Browse Files</div>
            </div>
        
      }
      contentTitle="The Safest Way to Share Large Files Online"
      content={
        <>
            <p>Traditional cloud storage platforms were built to store your files forever, not to share them temporarily. When you email an attachment or share a standard cloud link, you lose control of that data indefinitely. SnapLink's <strong>Secure File Sharing</strong> architecture is built entirely on the concept of ephemeral (temporary) storage.</p>
            
            <h3>Share Large Files up to 50MB</h3>
            <p>Whether you\'re sending high-resolution photography, massive video renders, or extensive PDF reports, SnapLink handles it effortlessly. Upload files up to 50MB directly from your browser with lightning-fast speeds.</p>
            
            <h3>Self-Destructing Links</h3>
            <p>Privacy is our priority. SnapLink allows you to configure files to <strong>automatically self-destruct</strong>. You can set a file to delete itself the moment it is downloaded by the recipient, or set a strict time limit (e.g., 24 hours). Once the file is deleted, it is permanently scrubbed from our servers, leaving absolutely zero trace.</p>
            
            <h3>Password Protection & Analytics</h3>
            <p>For highly sensitive legal documents or intellectual property, you can encrypt your download page with a secure password. Furthermore, our analytics dashboard will notify you exactly when your file was downloaded, giving you complete visibility into the transfer process.</p>
        </>
      }
      faqs={[
        { q: 'What happens when a file self-destructs?', a: 'When a file reaches its expiration timer or download limit, it is permanently and irreversibly deleted from our storage servers. The short link will display a \'File Expired\' message to anyone who clicks it.' }, { q: 'Do I need to install any software to upload or download?', a: 'No! SnapLink operates entirely within your web browser. Neither the sender nor the receiver needs to install any applications.' }, { q: 'Are my files secure during transfer?', a: 'Yes. All file transfers are secured using industry-standard SSL/TLS encryption, ensuring your data cannot be intercepted while in transit.' }
      ]}
    />
  );
}
