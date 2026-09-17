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
            The all-in-one suite for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#9333ea]">modern creators</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-[#5f6368] max-w-2xl leading-relaxed">
            We built SnapLink to solve our own problem: paying for 5 different subscriptions. Now you can shorten links, build a bio page, share secure files, and generate 3D vCards—all from one dashboard.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-[#1a73e8] text-white rounded-full font-medium text-lg hover:bg-[#1557b0] transition-colors focus:ring-4 focus:ring-[#1a73e8]/20 shadow-sm w-full sm:w-auto"
            >
              Start using SnapLink
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
              <p className="mt-4 text-[#5f6368] text-lg">Powerful tools built by developers, for creators.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-3">Smart URL Shortener</h3>
                <p className="text-[#5f6368] leading-relaxed">Create short, branded links with custom OpenGraph preview cards. Track clicks, locations, and referrers instantly.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-3">Advanced Link-in-Bio</h3>
                <p className="text-[#5f6368] leading-relaxed">Sell products, collect donations, and embed native video or audio directly in your beautifully themed bio page.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-3">Secure File Sharing</h3>
                <p className="text-[#5f6368] leading-relaxed">Upload PDFs, Resumes, or ZIP files securely with password protection, QR Codes, and auto-expiry links.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-white border-t border-[#dadce0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#202124]">Simple, honest pricing</h2>
              <p className="mt-4 text-[#5f6368] text-lg">We are a startup building tools for startups. No hidden fees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white rounded-3xl p-8 border border-[#dadce0] shadow-sm flex flex-col h-full">
                <h3 className="text-2xl font-bold text-[#202124]">Basic</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-[#202124]">
                  ₹0
                  <span className="ml-1 text-xl font-medium text-[#5f6368]">/forever</span>
                </div>
                <p className="mt-4 text-[#5f6368]">Perfect for testing out the platform.</p>
                <ul className="mt-8 space-y-4 flex-grow">
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Unlimited Short Links</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>1 Basic Bio Profile</li>
                  <li className="flex items-center text-[#5f6368]"><svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>File Sharing</li>
                  <li className="flex items-center text-[#5f6368]"><svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>API Access</li>
                </ul>
                <Link href="/register" className="mt-8 block w-full py-3 px-6 border border-[#dadce0] rounded-full text-center font-medium text-[#202124] hover:bg-gray-50 transition-colors">Get Started Free</Link>
              </div>

              {/* Pro Tier */}
              <div className="bg-[#1a73e8] rounded-3xl p-8 border border-[#1a73e8] shadow-xl relative transform md:-translate-y-4 flex flex-col h-full">
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Pro</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Creator Pro</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  ₹299
                  <span className="ml-1 text-xl font-medium text-blue-200">/month</span>
                </div>
                <p className="mt-4 text-blue-100">For active creators and growing audiences.</p>
                <ul className="mt-8 space-y-4 text-white flex-grow">
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Everything in Basic</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Advanced Bio (Products, Donations)</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Secure File Sharing (Up to 1GB)</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>3D vCard Generation</li>
                  <li className="flex items-center text-blue-300/50"><svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>API Access</li>
                </ul>
                <Link href="/register" className="mt-8 block w-full py-3 px-6 bg-white rounded-full text-center font-bold text-[#1a73e8] hover:bg-gray-100 transition-colors shadow-sm">Upgrade to Pro</Link>
              </div>

              {/* API Tier */}
              <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl flex flex-col h-full">
                <h3 className="text-2xl font-bold text-white">Developer API</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  ₹1499
                  <span className="ml-1 text-xl font-medium text-gray-400">/month</span>
                </div>
                <p className="mt-4 text-gray-400">Programmatic access for apps and software.</p>
                <ul className="mt-8 space-y-4 text-gray-300 flex-grow">
                  <li className="flex items-center"><svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Everything in Pro</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>5 Scoped API Keys</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Automated Link Generation</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Automated File Uploads</li>
                </ul>
                <Link href="/login" className="mt-8 block w-full py-3 px-6 bg-gray-800 border border-gray-700 rounded-full text-center font-bold text-white hover:bg-gray-700 transition-colors shadow-sm">Get API Key</Link>
              </div>

            </div>
          </div>
        </section>

        {/* Why We Built This Section */}
        <section className="py-24 bg-[#f8f9fa] border-t border-[#dadce0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#202124] mb-8">Why we built SnapLink</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#dadce0] text-left">
              <p className="text-lg text-[#5f6368] mb-6 leading-relaxed">
                As creators and developers, we were frustrated by the fragmented tools available online. We had to pay one company $15/mo just to host a bio page, another $10/mo to shorten links, and yet another to share large files securely. 
              </p>
              <p className="text-lg text-[#5f6368] leading-relaxed">
                We decided to build one platform that does it all. SnapLink is currently in its early stages as a fast-growing startup. By joining us today, you are helping shape a genuine platform that actually cares about solving real problems for creators.
              </p>
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
                <p className="mt-2 text-[#5f6368]">Yes! The Basic tier for creating short links and your Link-in-Bio profile is free forever. We support the platform through our Pro and Developer tiers.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#202124]">How do Custom SEO Previews work?</h4>
                <p className="mt-2 text-[#5f6368]">When you create a short link, you can upload an image and write a title. When you paste that short link into WhatsApp, Twitter, or iMessage, our server instantly injects your custom data so a beautiful preview card appears in the chat!</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#202124]">How does the API payment work?</h4>
                <p className="mt-2 text-[#5f6368]">Our Developer tier is ₹1499/month. Once active, you get 5 distinct, scoped API keys (Master, URL, Bio, File, vCard) to safely automate different parts of your workflow.</p>
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
