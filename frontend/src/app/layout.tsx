import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import SnowEffect from "@/components/SnowEffect";

import { SpeedInsights } from "@vercel/speed-insights/next";
import MaintenanceModal from "@/components/MaintenanceModal";
import RatingWidget from "@/components/RatingWidget";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.snaplinks.in'),
  title: {
    default: "SnapLinks | The Ultimate All-in-One Digital Workspace",
    template: "%s | SnapLinks",
  },
  description: "SnapLinks is the ultimate digital workspace for advanced URL shortening, Link-in-Bio pages, secure file sharing, and free PDF tools.",
  keywords: ["SnapLinks Tools", "URL shortener", "free PDF tools", "link in bio", "secure file sharing", "SnapPlay", "daily challenges", "mini-games", "digital business card", "3D vcard", "digital workspace", "link management", "peer to peer file share"],
  authors: [{ name: "SnapLinks Team", url: "https://www.snaplinks.in" }],
  creator: "SnapLinks",
  publisher: "SnapLinks",
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
  alternates: {
    canonical: "https://www.snaplinks.in",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.snaplinks.in",
    siteName: "SnapLinks",
    title: "SnapLinks | URL Shortener, Link-in-Bio, SnapPlay & File Sharing",
    description: "Your ultimate web workspace for deep link shortening, secure file sharing, customizable Link-in-Bio pages, and free PDF tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapLinks Digital Workspace Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SnapLinks",
    creator: "@SnapLinks",
    title: "SnapLinks | Advanced URL Shortener & Link-in-Bio",
    description: "Your ultimate digital workspace for advanced URL shortening, Link-in-Bio pages, secure file sharing, and free PDF tools.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code-here",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SnapLinks',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '124'
    },
    description: 'Your ultimate web workspace for deep link shortening, secure file sharing, Link-in-Bio pages, and free SnapLinks Tools.',
    url: 'https://www.snaplinks.in',
  };

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
                "name": "SnapLinks",
                "url": "https://www.snaplinks.in/",
                "logo": "https://www.snaplinks.in/logo.svg",
                "sameAs": [
                  "https://twitter.com/snaplinks",
                  "https://instagram.com/snaplinks"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "SnapLinks",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "124"
                },
                "description": "Secure file sharing and 3D digital business card generator platform."
              }
            ])
          }}
        />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3444542685708016" crossOrigin="anonymous" strategy="lazyOnload" />
      </head>
      <body className="min-h-full flex flex-col">
                <SnowEffect />
        <MaintenanceModal />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com"}>
          <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        </GoogleOAuthProvider>
        <Analytics />
        <SpeedInsights />
        <RatingWidget />
      </body>
    </html>
  );
}
