import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4 font-sans">
      <h1 className="text-6xl md:text-7xl font-bold text-[#202124] tracking-tight">
        Snap<span className="text-[#1a73e8]">Link</span>
      </h1>
      <p className="mt-6 text-xl text-[#5f6368] max-w-2xl leading-relaxed">
        The ultimate Link-in-Bio platform. Create a beautiful, customizable profile to share all your content, and shorten URLs on the side.
      </p>
      
      <div className="mt-10 flex gap-4">
        <Link 
          href="/register" 
          className="px-8 py-3.5 bg-[#1a73e8] text-white rounded-full font-medium hover:bg-[#1557b0] transition-colors focus:ring-4 focus:ring-[#1a73e8]/20"
        >
          Create your Bio
        </Link>
        <Link 
          href="/login" 
          className="px-8 py-3.5 bg-white text-[#1a73e8] border border-[#dadce0] rounded-full font-medium hover:bg-[#f8f9fa] transition-colors"
        >
          Login
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#1a73e8] transition-colors text-left flex flex-col items-start group">
          <div className="w-12 h-12 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">✨</div>
          <h3 className="text-xl font-medium text-[#202124]">Link-in-Bio</h3>
          <p className="mt-3 text-[#5f6368] leading-relaxed">Build a stunning, custom mobile-friendly page to house all your important links.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#34a853] transition-colors text-left flex flex-col items-start group">
          <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#34a853] flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">🔗</div>
          <h3 className="text-xl font-medium text-[#202124]">Shorten Links</h3>
          <p className="mt-3 text-[#5f6368] leading-relaxed">Create memorable short URLs with password protection, aliases, and expiration dates.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#fbbc04] transition-colors text-left flex flex-col items-start group">
          <div className="w-12 h-12 rounded-full bg-[#fef7e0] text-[#f9ab00] flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">💎</div>
          <h3 className="text-xl font-medium text-[#202124]">Monetize</h3>
          <p className="mt-3 text-[#5f6368] leading-relaxed">Generate revenue automatically with built-in ad monetisation on every link you share.</p>
        </div>
      </div>
    </div>
  );
}
