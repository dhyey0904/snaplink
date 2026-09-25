import re
with open("frontend/src/app/tools/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_meta = '''export const metadata = {
  title: 'Free PDF Tools & Document Converters | SnapTools',
  description: 'Merge, split, compress, watermark, and convert PDF documents for free. 100% browser-based and secure.',
};'''

new_meta = '''export const metadata = {
  title: 'Snap Tools | Free PDF Tools, Document Converters & Web Utilities',
  description: 'Access Snap Tools to merge, split, compress, watermark, and convert PDF documents for free. 100% browser-based, secure, and part of the Snap OS ecosystem.',
  keywords: ["Snap Tools", "free PDF tools", "PDF compressor", "merge PDF", "split PDF", "web utilities", "Snap OS"],
  alternates: {
    canonical: "https://www.snaplinks.in/tools",
  },
  openGraph: {
    title: 'Snap Tools | Free PDF & Web Utilities',
    description: 'Merge, split, compress, watermark, and convert PDF documents for free instantly in your browser.',
    url: 'https://www.snaplinks.in/tools',
  }
};'''

content = content.replace(old_meta, new_meta)

with open("frontend/src/app/tools/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated tools metadata")
