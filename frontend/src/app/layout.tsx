import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.snaplinks.in'),
  title: {
    default: "SnapLink | Advanced URL Shortener & Link-in-Bio",
    template: "%s | SnapLink",
  },
  description: "SnapLink is the ultimate all-in-one workspace featuring deep link shortening, secure file sharing, Link-in-Bio pages, and free Snap Tools for PDF & web utilities.",
  keywords: ["Snap Tools", "URL shortener", "free PDF tools", "link in bio", "secure file sharing", "ephemeral file transfer", "digital business card", "3D vcard"],
  authors: [{ name: "SnapLink" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.snaplinks.in",
    siteName: "SnapLink",
    title: "SnapLink | Advanced URL Shortener & Link-in-Bio",
    description: "Your ultimate web workspace for deep link shortening, secure file sharing, Link-in-Bio pages, and free Snap Tools.",
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
    description: "Your ultimate web workspace for deep link shortening, secure file sharing, Link-in-Bio pages, and free Snap Tools.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SnapLink',
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
    description: 'Your ultimate web workspace for deep link shortening, secure file sharing, Link-in-Bio pages, and free Snap Tools.',
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
