import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# The Link is:
# <Link href="/bridge" className="inline-flex items-center gap-2 bg-[#1557b0] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
#   Open a Secure Space
#   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
# </Link>

# Hide the first one on mobile (add hidden lg:inline-flex)
old_link = """<Link href="/bridge" className="inline-flex items-center gap-2 bg-[#1557b0] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
                    Open a Secure Space
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>"""
new_link = """<Link href="/bridge" className="hidden lg:inline-flex items-center gap-2 bg-[#1557b0] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
                    Open a Secure Space
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>"""

c = c.replace(old_link, new_link)

# Add the mobile button below the mockup
mockup_end = """                      </div>
                    </div>
                  </div>
                </div>"""

mobile_button = """                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Button at Bottom */}
                <div className="w-full lg:hidden flex justify-center mt-2 z-20">
                  <Link href="/bridge" className="w-full flex items-center justify-center gap-2 bg-[#1557b0] hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md text-lg">
                    Open a Secure Space
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>"""

# Only replace the specific ending of the mockup
if mockup_end in c:
    c = c.replace(mockup_end, mobile_button)
else:
    print("Could not find mockup end")

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Moved SnapBridge button to bottom on mobile")
