import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#202124] flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full border-b border-[#dadce0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight">
                Snap<span className="text-[#1a73e8]">Link</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors hidden sm:block"
              >
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-medium bg-[#1a73e8] text-white px-5 py-2.5 rounded-full hover:bg-[#1557b0] transition-colors focus:ring-4 focus:ring-[#1a73e8]/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="px-4 sm:px-6 lg:px-8 pt-24 pb-32 max-w-7xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#202124] tracking-tight leading-tight max-w-4xl">
            One link to share <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#9333ea]">everything you create</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-[#5f6368] max-w-2xl leading-relaxed">
            The ultimate Link-in-Bio and URL Shortener platform. Create a beautiful, customizable profile to share your content, shorten links, and monetize your audience effortlessly.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-[#1a73e8] text-white rounded-full font-medium text-lg hover:bg-[#1557b0] transition-colors focus:ring-4 focus:ring-[#1a73e8]/20 shadow-sm w-full sm:w-auto"
            >
              Create your Bio for free
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-white text-[#5f6368] border border-[#dadce0] rounded-full font-medium text-lg hover:bg-[#f8f9fa] hover:text-[#202124] transition-colors w-full sm:w-auto"
            >
              Login to Dashboard
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#f8f9fa] border-t border-[#dadce0] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#202124]">Everything you need to grow</h2>
              <p className="mt-4 text-[#5f6368] text-lg">Powerful tools designed for creators, marketers, and developers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#1a73e8] hover:shadow-md transition-all text-left flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">📈</div>
                <h3 className="text-xl font-bold text-[#202124]">Advanced Analytics</h3>
                <p className="mt-3 text-[#5f6368] leading-relaxed">Track your success with our beautiful dashboard. Monitor clicks over time, device types, browsers, and top referring websites.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#9333ea] hover:shadow-md transition-all text-left flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">🖼️</div>
                <h3 className="text-xl font-bold text-[#202124]">Custom SEO Previews</h3>
                <p className="mt-3 text-[#5f6368] leading-relaxed">Control exactly how your link looks on WhatsApp and Twitter. Inject custom Open Graph images, titles, and descriptions.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#ea4335] hover:shadow-md transition-all text-left flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">✨</div>
                <h3 className="text-xl font-bold text-[#202124]">Animated Themes</h3>
                <p className="mt-3 text-[#5f6368] leading-relaxed">Make your Bio page stand out. Unlock premium Glassmorphism and beautiful animated gradient backgrounds.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#1a73e8] hover:shadow-md transition-all text-left flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">🔗</div>
                <h3 className="text-xl font-bold text-[#202124]">Link-in-Bio Profiles</h3>
                <p className="mt-3 text-[#5f6368] leading-relaxed">Build a stunning, mobile-friendly landing page to house all your important links in one place. Customize it to match your brand.</p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#34a853] hover:shadow-md transition-all text-left flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-[#e6f4ea] text-[#34a853] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">✂️</div>
                <h3 className="text-xl font-bold text-[#202124]">Smart URL Shortener</h3>
                <p className="mt-3 text-[#5f6368] leading-relaxed">Create memorable short URLs. Protect them with passwords, set expiration dates, and generate instant QR codes.</p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#fbbc04] hover:shadow-md transition-all text-left flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-[#fef7e0] text-[#f9ab00] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">💰</div>
                <h3 className="text-xl font-bold text-[#202124]">Ad Monetization</h3>
                <p className="mt-3 text-[#5f6368] leading-relaxed">Turn your traffic into revenue. Enable our built-in 5-second ad monetization modal on your links to earn money automatically.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#dadce0] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <span className="text-xl font-bold tracking-tight text-[#202124] mb-4 sm:mb-0">
            Snap<span className="text-[#1a73e8]">Link</span>
          </span>
          <p className="text-[#5f6368] text-sm">
            © {new Date().getFullYear()} SnapLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
