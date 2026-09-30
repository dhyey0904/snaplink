import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

snapbridge_section = """
        {/* SNAPBRIDGE SECTION */}
        <section id="snapbridge" className="py-24 bg-gray-900 relative overflow-hidden border-t border-gray-800">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[150px] opacity-20 pointer-events-none"></div>
          
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              <div className="w-full lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-6 border border-emerald-500/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Zero-Trace Transfer
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">SnapBridge.</span>
                </h2>
                <p className="text-gray-400 text-xl leading-relaxed mb-8">
                  A lightning-fast, peer-to-peer secure room for transferring files between your devices. Scan the QR code, drop your files, and watch them self-destruct 60 seconds after download. No cloud storage, no traces left behind.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                    Instant QR Code Pairing
                  </li>
                  <li className="flex items-center gap-3 text-gray-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                    Ultra-fast in-memory RAM buffer
                  </li>
                  <li className="flex items-center gap-3 text-gray-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                    60-second Auto-Destruct
                  </li>
                </ul>
                
                <Link href="/bridge" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/30">
                  Open a Secure Space
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
              
              <div className="w-full lg:w-1/2 relative">
                <div className="bg-gray-800 rounded-3xl p-2 shadow-2xl border border-gray-700">
                  <div className="bg-gray-900 rounded-2xl p-6 h-96 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-full max-w-sm bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-700 text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1">Drop file to transfer</h3>
                      <p className="text-gray-400 text-sm">File will sync instantly to paired devices</p>
                    </div>
                    
                    <div className="absolute top-6 right-6 bg-gray-800 border border-gray-700 shadow-xl rounded-xl p-3 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="w-10 h-10 bg-white rounded-lg p-1"><svg viewBox="0 0 100 100"><rect width="40" height="40" fill="black"/><rect x="60" width="40" height="40" fill="black"/><rect y="60" width="40" height="40" fill="black"/><rect x="60" y="60" width="40" height="40" fill="black"/></svg></div>
                      <div>
                        <div className="text-xs text-gray-400 font-bold uppercase">Room Code</div>
                        <div className="text-white font-mono font-bold tracking-widest text-sm">z8Fq2P</div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 bg-gray-800 border border-emerald-500/30 shadow-xl shadow-emerald-500/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-md flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                      <div>
                        <div className="text-white font-bold text-sm">project_v2.zip</div>
                        <div className="text-xs text-gray-400">Downloaded. Self-destructing...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
"""

c = c.replace("{/* SNAPTOOLS SECTION */}", snapbridge_section + "\n          {/* SNAPTOOLS SECTION */}")

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Injected SnapBridge Section")
