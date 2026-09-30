import re

with open('frontend/src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Change grid-cols-4 to grid-cols-5
c = c.replace('grid-cols-2 md:grid-cols-4 gap-8 mb-12', 'grid-cols-2 lg:grid-cols-5 gap-8 mb-12')

# Replace column 2 (RESOURCES) and add a FREE TOOLS column
col2_start = '{/* Column 2: Resources */}'
col4_start = '{/* Column 4: Legal */}'

s_idx = c.find(col2_start)
e_idx = c.find(col4_start)

replacement = """{/* Column 2: Solutions */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 tracking-wide text-sm">SOLUTIONS</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/url-shortener" className="hover:text-[#1557b0] transition-colors">URL Shortener</Link></li>
              <li><Link href="/linktree-alternative" className="hover:text-[#1557b0] transition-colors">Link-in-Bio</Link></li>
              <li><Link href="/file-sharing" className="hover:text-[#1557b0] transition-colors">File Sharing</Link></li>
              <li><Link href="/digital-business-card" className="hover:text-[#1557b0] transition-colors">3D vCards</Link></li>
              <li><Link href="/blog" className="hover:text-[#1557b0] transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Free Tools */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 tracking-wide text-sm">FREE TOOLS</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tools/image-compressor" className="hover:text-[#1557b0] transition-colors">Image Compressor</Link></li>
              <li><Link href="/tools/compress-pdf" className="hover:text-[#1557b0] transition-colors">PDF Compressor</Link></li>
              <li><Link href="/tools/split-pdf" className="hover:text-[#1557b0] transition-colors">Split PDF</Link></li>
              <li><Link href="/b/new" className="hover:text-[#1557b0] transition-colors">SnapBridge Transfer</Link></li>
              <li><Link href="/tools" className="hover:text-[#1557b0] transition-colors">All Web Tools &rarr;</Link></li>
            </ul>
          </div>

          """

c = c[:s_idx] + replacement + c[e_idx:]

with open('frontend/src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated footer")
