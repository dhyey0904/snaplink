import re

with open('frontend/src/app/tools/page.tsx', 'r', encoding='utf-8') as f:
    tools = f.read()

# Add to the beginning of the TOOLS array
compressor = """{ category: 'Image Converters', id: 'img-compressor', name: 'Image Compressor', desc: 'World-class image compression with advanced formatting, EXIF control, and WebP support.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-emerald-500', href: '/tools/image-compressor' },
  """
tools = tools.replace("const TOOLS = [", "const TOOLS = [\n  " + compressor)

with open('frontend/src/app/tools/page.tsx', 'w', encoding='utf-8') as f:
    f.write(tools)

with open('frontend/src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav = f.read()

# Add to navbar
navbar_html = """<div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Image Tools</div>
                        <div className="space-y-0.5">
                          <Link href="/tools/image-compressor" className="flex items-center gap-3 px-2 py-2 text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-[#1557b0] rounded-lg transition-colors group/item">
                            <div className="w-5 h-5 rounded bg-blue-50 text-[#1557b0] flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                            Image Compressor
                          </Link>
                        </div>
                      </div>"""
nav = nav.replace('<!-- SNAPTOOLS_INJECT -->', navbar_html + '\n<!-- SNAPTOOLS_INJECT -->')
# Wait, let's just insert it after the "Optimize PDF" section
nav = nav.replace('<div>\n                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Edit & Security</div>', navbar_html + '\n                      <div>\n                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Edit & Security</div>')

with open('frontend/src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav)

print("Linked frontend")
