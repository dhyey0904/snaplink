import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
  title: "Link in Bio & URL Shortener for Creators | SnapLink",
  description: "Create a customizable link-in-bio page, shorten URLs, track clicks, and control social previews with SnapLink.",
  alternates: {
    canonical: "https://www.snaplinks.in/",
  },
  openGraph: {
    title: "Link in Bio & URL Shortener for Creators | SnapLink",
    description: "Create a customizable link-in-bio page, shorten URLs, track clicks, and control social previews with SnapLink.",
    url: "https://www.snaplinks.in/",
    siteName: "SnapLink",
    images: [
      {
        url: "https://www.snaplinks.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SnapLink Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Link in Bio & URL Shortener for Creators | SnapLink",
    description: "Create a customizable link-in-bio page, shorten URLs, track clicks, and control social previews with SnapLink.",
    images: ["https://www.snaplinks.in/og-image.jpg"],
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
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SnapLink",
              "url": "https://www.snaplinks.in/",
              "logo": "https://www.snaplinks.in/logo.png",
              "sameAs": [
                "https://twitter.com/snaplinks",
                "https://instagram.com/snaplinks"
              ]
            })
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3444542685708016"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleOAuthProvider clientId="234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
