import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-4xl md:text-5xl font-black text-[#202124] tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose prose-lg prose-blue max-w-none text-[#5f6368]">
          
          <p className="text-xl mb-6">Last updated: September 2026</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Information We Collect</h2>
          <p className="mb-6">We collect information you provide directly to us when you create an account, generate short links, upload files, or create a digital business card. This may include your email address, analytics data (like IP addresses of link visitors), and file metadata.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Secure File Transfer</h2>
          <p className="mb-6">Files uploaded to SnapLink are encrypted in transit. Once a file reaches its expiration time, it is permanently deleted from our servers. We do not inspect the contents of your secure files unless legally required.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. How We Use Your Data</h2>
          <p>Your data is used strictly to provide the SnapLink service. We do not sell your personal data to third-party data brokers or advertising networks.</p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
