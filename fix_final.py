import re

c = """
              {/* Feature 1 */}
              <div className="w-[280px] shrink-0 bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Custom URLs</h3>
                <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Create short, trackable links with custom social media preview cards.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="w-[280px] shrink-0 bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Bio Pages</h3>
                <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Build beautiful mobile landing pages for your Instagram or TikTok profile.</p>
              </div>

              {/* Feature 3 */}
              <div className="w-[280px] shrink-0 bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">File Sharing</h3>
                <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Share files securely with password protection and auto-expiry.</p>
              </div>

              {/* Feature 4 */}
              <div className="w-[280px] shrink-0 bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">3D vCards</h3>
                <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Design stunning interactive digital business cards for networking.</p>
              </div>
              
              {/* Feature 5 */}
              <div className="w-[280px] shrink-0 bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl z-10">New</div>
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">SnapBridge</h3>
                <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Lightning-fast peer-to-peer file transfer rooms that self-destruct.</p>
              </div>
"""

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    page = f.read()

# I will find the ALL-IN-ONE TOOLKIT section and replace the ENTIRE wrapper
# Let's find <section className="py-24 bg-white text-[#202124] relative border-t border-gray-100">
# and end at {/* API ACCESS SECTION */}

start_marker = '{/* ALL-IN-ONE TOOLKIT */}'
end_marker = '{/* API ACCESS SECTION */}'

if start_marker in page and end_marker in page:
    s_idx = page.find(start_marker)
    e_idx = page.find(end_marker)
    
    # Rebuild the section entirely
    replacement = f"""{{/* ALL-IN-ONE TOOLKIT */}}
          <section className="py-24 bg-white text-[#202124] relative border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#202124]">Everything you need, in one place.</h2>
                <p className="text-[#5f6368] text-lg max-w-2xl mx-auto">SnapLinks replaces your fragmented tools with one seamless, incredibly powerful dashboard.</p>
              </div>
  
              <div className="relative w-full overflow-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex gap-8 group">
                  <div className="flex shrink-0 animate-marquee gap-8 group-hover:[animation-play-state:paused]">
                    {c}
                  </div>
                  <div className="flex shrink-0 animate-marquee gap-8 group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {c}
                  </div>
                  <div className="flex shrink-0 animate-marquee gap-8 group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {c}
                  </div>
                </div>
              </div>
            </div>
          </section>

          """
          
    new_page = page[:s_idx] + replacement + page[e_idx:]
    with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_page)
    print("Fixed page.tsx syntax error entirely")
else:
    print("Markers not found")
