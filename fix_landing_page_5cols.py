import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Change it to 5!
c = c.replace('grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8', 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8')

# Let's find exactly where to inject by splitting on "3D vCards"
parts = c.split('<h3 className="text-xl font-bold mb-3 text-gray-900">3D vCards</h3>')

# The closing div of Feature 4 is somewhere after this
# 3D vCards ... </p>\n                </div>
if len(parts) > 1:
    second_part = parts[1]
    
    # Find the closing div of the card
    close_div_idx = second_part.find('</div>')
    
    if close_div_idx != -1:
        # After this closing div, we inject SnapBridge!
        insertion_point = close_div_idx + 6
        
        snapbridge = """
                {/* Feature 5 */}
                <div className="bg-[#fafafc] rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl z-10">New</div>
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">SnapBridge</h3>
                  <p className="text-gray-600 text-base sm:text-sm leading-relaxed">Lightning-fast peer-to-peer file transfer rooms that self-destruct.</p>
                </div>"""
        
        c = parts[0] + '<h3 className="text-xl font-bold mb-3 text-gray-900">3D vCards</h3>' + second_part[:insertion_point] + snapbridge + second_part[insertion_point:]

        with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
            f.write(c)
        print("Injected SnapBridge perfectly")

