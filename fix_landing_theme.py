import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# We need to replace the entire <section id="snapbridge"> ... </section>
search_pattern = r'\{\/\* SNAPBRIDGE SECTION \*\/\}.*?(?=\{\/\* SNAPTOOLS SECTION \*\/\})'

new_section = """{/* SNAPBRIDGE SECTION */}
        <section id="snapbridge" className="py-24 bg-[#fafafc] relative overflow-hidden border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
              
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1557b0] text-sm font-bold uppercase tracking-wider mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Zero-Trace Transfer
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#202124] mb-6 leading-tight">
                  Meet <span className="text-[#1557b0]">SnapBridge.</span>
                </h2>
                <p className="text-[#5f6368] text-xl leading-relaxed mb-8">
                  A lightning-fast, peer-to-peer secure room for transferring files between your devices. Scan the QR code, drop your files, and watch them self-destruct 60 seconds after download. No cloud storage, no traces left behind.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#1557b0] shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                    Instant QR Code Pairing
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#1557b0] shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                    Ultra-fast in-memory RAM buffer
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#1557b0] shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                    60-second Auto-Destruct
                  </li>
                </ul>
                
                <Link href="/bridge" className="inline-flex items-center gap-2 bg-[#1557b0] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
                  Open a Secure Space
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
              
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="bg-gray-50 rounded-3xl p-2 shadow-inner border border-gray-200">
                  <div className="bg-white rounded-2xl p-6 h-96 flex flex-col items-center justify-center relative overflow-hidden border border-gray-100">
                    <div className="w-full max-w-sm bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-blue-50 text-[#1557b0] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      </div>
                      <h3 className="text-gray-900 font-bold text-lg mb-1">Drop file to transfer</h3>
                      <p className="text-gray-500 text-sm">File will sync instantly to paired devices</p>
                    </div>
                    
                    <div className="absolute top-6 right-6 bg-white border border-gray-200 shadow-lg rounded-xl p-3 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="w-10 h-10 bg-gray-100 rounded-lg p-1"><svg viewBox="0 0 100 100"><rect width="40" height="40" fill="currentColor" className="text-gray-800"/><rect x="60" width="40" height="40" fill="currentColor" className="text-gray-800"/><rect y="60" width="40" height="40" fill="currentColor" className="text-gray-800"/><rect x="60" y="60" width="40" height="40" fill="currentColor" className="text-gray-800"/></svg></div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Room Code</div>
                        <div className="text-gray-900 font-mono font-bold tracking-widest text-sm">z8Fq2P</div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 bg-white border border-orange-200 shadow-lg rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-md flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                      <div>
                        <div className="text-gray-900 font-bold text-sm">project_v2.zip</div>
                        <div className="text-xs text-orange-500 font-bold">Downloaded. Self-destructing...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
        """

c = re.sub(search_pattern, new_section, c, flags=re.DOTALL)

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Re-themed SnapBridge Section")
