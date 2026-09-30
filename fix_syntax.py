import re

file = 'frontend/src/app/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the broken syntax block
broken = """  alternates: {
    canonical: "https://www.snaplinks.in",
  },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',"""

fixed = """  alternates: {
    canonical: "https://www.snaplinks.in",
  },
  manifest: '/manifest.json',"""

c = c.replace(broken, fixed)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed syntax")
