import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure File Sharing & 3D Digital vCards | SnapLink",
  description: "SnapLink is the ultimate platform for secure file sharing and digital identity. Share 1GB files with self-destructing links and generate 3D vCards.",
  keywords: ["secure file sharing", "ephemeral file transfer", "digital business card", "3D vcard", "link in bio", "URL shortener"],
  alternates: {
    canonical: "https://www.snaplinks.in/",
  },
  openGraph: {
    title: "Secure File Sharing & Digital Identity | SnapLink",
    description: "Share files securely with passwords and auto-expiry. Generate interactive 3D digital business cards. The ultimate platform for creators and professionals.",
    url: "https://www.snaplinks.in/",
    siteName: "SnapLink",
    images: [
      {
        url: "https://www.snaplinks.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SnapLink - File Sharing and Digital Identity",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure File Sharing & 3D Digital vCards | SnapLink",
    description: "Share 1GB files securely with auto-destructing links. Create your premium 3D digital business card today.",
    images: ["https://www.snaplinks.in/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-3444542685708016" />
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "SnapLink",
                "url": "https://www.snaplinks.in/",
                "logo": "https://www.snaplinks.in/logo.png",
                "sameAs": [
                  "https://twitter.com/snaplinks",
                  "https://instagram.com/snaplinks"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "SnapLink",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "Secure file sharing and 3D digital business card generator platform."
              }
            ])
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3444542685708016" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleOAuthProvider clientId="234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
