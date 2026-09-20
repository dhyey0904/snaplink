import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-4xl md:text-5xl font-black text-[#202124] tracking-tight mb-8">Terms of Service</h1>
        <div className="prose prose-lg prose-blue max-w-none text-[#5f6368]">
          
          <p className="text-xl mb-6">Last updated: September 2026</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">By accessing or using SnapLink, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our platform.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Acceptable Use</h2>
          <p className="mb-6">You may not use SnapLink to distribute malware, host phishing sites, or share illegal content. We reserve the right to instantly terminate accounts and delete links that violate this policy.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. API Usage</h2>
          <p>API access is subject to rate limiting. Reverse engineering the platform or abusing the API to circumvent subscription limits will result in a permanent ban.</p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
