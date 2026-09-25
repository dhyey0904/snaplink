import re

with open("frontend/src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_meta_pattern = r'export const metadata: Metadata = \{[\s\S]*?apple: \[\n      \{ url: \'/apple-touch-icon\.png\', sizes: \'180x180\' \},\n    \],\n  \},?\n\}?;?'

new_meta = '''export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://snaplink.cc'),
  title: {
    default: "SnapLink | Advanced URL Shortener & Link-in-Bio",
    template: "%s | SnapLink",
  },
  description: "SnapLink is the ultimate platform for secure file sharing, deep link shortening, and beautifully designed 3D digital business cards and Link-in-Bio pages.",
  keywords: ["URL shortener", "link in bio", "secure file sharing", "ephemeral file transfer", "digital business card", "3D vcard"],
  authors: [{ name: "SnapLink" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://snaplink.cc",
    siteName: "SnapLink",
    title: "SnapLink | Advanced URL Shortener & Link-in-Bio",
    description: "The ultimate platform for secure file sharing, deep link shortening, and beautifully designed 3D digital business cards.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapLink Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapLink | Advanced URL Shortener",
    description: "The ultimate platform for secure file sharing, deep link shortening, and beautifully designed 3D digital business cards.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
};'''

# We need to find the exact old metadata block to replace.
# Let's just use string finding since regex with optional closing braces is tricky.
start_idx = content.find("export const metadata: Metadata = {")
end_idx = content.find("export default function RootLayout({")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_meta + "\n\n" + content[end_idx:]

with open("frontend/src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated layout metadata")
