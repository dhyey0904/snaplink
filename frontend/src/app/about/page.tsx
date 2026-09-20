import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-4xl md:text-5xl font-black text-[#202124] tracking-tight mb-8">About Us</h1>
        <div className="prose prose-lg prose-blue max-w-none text-[#5f6368]">
          
          <p className="text-xl mb-6">SnapLink is the ultimate unified workspace for creators, developers, and professionals to manage their digital presence.</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Mission</h2>
          <p className="mb-6">We built SnapLink because we were tired of paying for 5 different subscriptions just to share files, shorten links, and host a link-in-bio. We believe that managing your digital identity should be seamless, powerful, and affordable.</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Team</h2>
          <p>SnapLink is proudly designed and engineered by <strong>Dhyey</strong>, with a focus on enterprise-grade reliability, clean UI, and developer-first APIs.</p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
