import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's replace the heading
c = c.replace('<h3 className="text-2xl font-bold text-gray-900">Image Converters</h3>', '<h3 className="text-2xl font-bold text-gray-900">Image Compressor</h3>')

# Let's replace the link button
c = c.replace('Try Converters\n                  </Link>', 'Compress Images\n                  </Link>')

# Let's replace the link href
c = c.replace('href="/tools" className="inline-block w-full text-center bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"', 'href="/tools/image-compressor" className="inline-block w-full text-center bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"')

# Let's replace the icon color
c = c.replace('bg-purple-100 text-purple-600', 'bg-emerald-100 text-emerald-600')

# Let's replace the "NEW" badge from purple to emerald
c = c.replace('bg-gradient-to-r from-purple-500 to-pink-500', 'bg-gradient-to-r from-emerald-400 to-teal-500')

# Let's replace the bullets. They are currently JPG/PNG/WEBP, SVG/GIF to PNG, Image to PDF.
# We want to change the text inside the <li>s for this card.
# The card contains "Image Compressor", we can just replace the strings directly since they are unique.
c = c.replace('JPG / PNG / WEBP / AVIF', 'Compress without losing quality')
c = c.replace('SVG & GIF to PNG/JPG', 'Set target file size accurately')
c = c.replace('Image to PDF Generation', 'Supports WebP, AVIF, PNG, JPG')

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Card successfully updated to Image Compressor")
