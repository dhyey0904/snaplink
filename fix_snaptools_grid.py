import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix SnapTools Grid!
search_str = """            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-base sm:text-sm font-bold text-pink-700 mb-6 uppercase tracking-wider">
                100% Free Tools
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#202124] mb-6 leading-tight">
                Introducing SnapTools Suite
              </h2>
              <p className="text-[#5f6368] text-xl max-w-2xl mx-auto leading-relaxed">
                A powerful suite of document and image tools that run entirely in your browser. Fast, secure, and limitless conversions with zero server uploads. <strong className="text-gray-900">No signup required.</strong>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">"""

replace_str = """            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-base sm:text-sm font-bold text-pink-700 mb-6 uppercase tracking-wider">
                100% Free Tools
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#202124] mb-6 leading-tight">
                Introducing SnapTools Suite
              </h2>
              <p className="text-[#5f6368] text-xl max-w-2xl mx-auto leading-relaxed">
                A powerful suite of document and image tools that run entirely in your browser. Fast, secure, and limitless conversions with zero server uploads. <strong className="text-gray-900">No signup required.</strong>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">"""

c = c.replace(search_str, replace_str)

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed SnapTools Grid")
