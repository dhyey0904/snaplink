import Link from "next/link";
import Footer from '@/components/Footer';

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

          <div className="mt-20 pt-10 border-t border-gray-200 w-full">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Trusted by creators & developers worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-60 grayscale">
              <svg className="h-8" viewBox="0 0 100 30" fill="currentColor"><text x="0" y="20" fontSize="20" fontWeight="bold">TechCrunch</text></svg>
              <svg className="h-8" viewBox="0 0 100 30" fill="currentColor"><text x="0" y="20" fontSize="20" fontWeight="bold">The Verge</text></svg>
              <svg className="h-8" viewBox="0 0 100 30" fill="currentColor"><text x="0" y="20" fontSize="20" fontWeight="bold">Wired</text></svg>
              <svg className="h-8" viewBox="0 0 100 30" fill="currentColor"><text x="0" y="20" fontSize="20" fontWeight="bold">Forbes</text></svg>
            </div>
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
              <div className="bg-white p-8 rounded-2xl border border-[#dadce0] hover:border-[#202124] hover:shadow-md transition-all text-left flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">💻</div>
                <h3 className="text-xl font-bold text-[#202124]">Developer API Access</h3>
                <p className="mt-3 text-[#5f6368] leading-relaxed">Automate your workflow. Use our robust REST API to programmatically generate short links, QR codes, and read analytics data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="py-24 bg-white border-t border-[#dadce0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] mb-4">See SnapLink in action</h2>
            <p className="text-[#5f6368] text-lg mb-16 max-w-2xl mx-auto">Everything you need to manage your links, track your performance, and customize your brand, all in one intuitive dashboard.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-[#f8f9fa] rounded-2xl border border-[#dadce0] p-4 shadow-xl overflow-hidden h-[400px] flex items-center justify-center">
                {/* Placeholder for Analytics Screenshot */}
                <div className="text-[#5f6368] font-medium flex flex-col items-center">
                  <svg className="w-16 h-16 text-[#1a73e8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  [Analytics Dashboard Screenshot]
                </div>
              </div>
              <div className="bg-[#f8f9fa] rounded-2xl border border-[#dadce0] p-4 shadow-xl overflow-hidden h-[400px] flex items-center justify-center">
                {/* Placeholder for Bio Page Screenshot */}
                <div className="text-[#5f6368] font-medium flex flex-col items-center">
                  <svg className="w-16 h-16 text-[#9333ea] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  [Bio Page Themes Screenshot]
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-[#f8f9fa] border-t border-[#dadce0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#202124]">Simple, transparent pricing</h2>
              <p className="mt-4 text-[#5f6368] text-lg">Start for free, upgrade when you need programmatic access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white rounded-3xl p-8 border border-[#dadce0] shadow-sm">
                <h3 className="text-2xl font-bold text-[#202124]">Creator</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-[#202124]">
                  ₹0
                  <span className="ml-1 text-xl font-medium text-[#5f6368]">/forever</span>
                </div>
                <p className="mt-4 text-[#5f6368]">Perfect for individuals and creators starting out.</p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Unlimited Short Links</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>1 Link-in-Bio Profile</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Advanced Analytics</li>
                  <li className="flex items-center text-[#5f6368]"><svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>API Access</li>
                </ul>
                <Link href="/register" className="mt-8 block w-full py-3 px-6 border border-[#dadce0] rounded-full text-center font-medium text-[#202124] hover:bg-gray-50 transition-colors">Get Started Free</Link>
              </div>

              {/* Pro Tier */}
              <div className="bg-[#1a73e8] rounded-3xl p-8 border border-[#1a73e8] shadow-xl relative transform md:-translate-y-4">
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Developer API</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  ₹199
                  <span className="ml-1 text-xl font-medium text-blue-200">/lifetime</span>
                </div>
                <p className="mt-4 text-blue-100">For businesses that need programmatic automation.</p>
                <ul className="mt-8 space-y-4 text-white">
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Everything in Creator</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Full REST API Access</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Programmatic Link Generation</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Priority Support</li>
                </ul>
                <Link href="/login" className="mt-8 block w-full py-3 px-6 bg-white rounded-full text-center font-bold text-[#1a73e8] hover:bg-gray-100 transition-colors shadow-sm">Unlock API</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white border-t border-[#dadce0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#202124] text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-bold text-[#202124]">Is it really free?</h4>
                <p className="mt-2 text-[#5f6368]">Yes! Our core platform for creating short links and your Link-in-Bio profile is completely free forever. We support our free tier through lightweight, unobtrusive ads shown during redirects.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#202124]">How do Custom SEO Previews work?</h4>
                <p className="mt-2 text-[#5f6368]">When you create a short link, you can upload an image and write a title. When you paste that short link into WhatsApp, Twitter, or iMessage, our server instantly injects your custom data so a beautiful preview card appears in the chat!</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#202124]">How does the API payment work?</h4>
                <p className="mt-2 text-[#5f6368]">It is a simple, one-time lifetime payment of ₹199. No subscriptions, no hidden fees. Once unlocked, you can generate unlimited API keys from your dashboard to automate your workflow.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
