import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Change grid-cols-4 to grid-cols-3
c = c.replace('grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8', 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8')

# We need to insert SnapBridge and SnapTools after 3D vCards
vcard_block = """                {/* Feature 4 */}
                <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">3D vCards</h3>
                  <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Design stunning interactive digital business cards for networking.</p>
                </div>"""

new_blocks = """
                {/* Feature 5 */}
                <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-50 text-[#1557b0] rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">SnapTools Suite</h3>
                  <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Instantly convert images, extract PDFs, and format JSON in browser.</p>
                </div>
                
                {/* Feature 6 */}
                <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl z-10">New</div>
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">SnapBridge Space</h3>
                  <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Lightning-fast peer-to-peer file transfer rooms that self-destruct.</p>
                </div>"""

c = c.replace(vcard_block, vcard_block + new_blocks)

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Landing page modified")
