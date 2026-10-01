import re

file = 'frontend/src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add server fetch to get real rating
imports = """import BioBuilderMock from '@/components/BioBuilderMock';
import FileDropzoneMock from '@/components/FileDropzoneMock';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Fetch real rating for SEO
async function getRatingSummary() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com';
    const res = await fetch(`${backendUrl}/api/rating/summary`, { next: { revalidate: 3600 } });
    if (!res.ok) return { average: 5.0, count: 1 };
    return await res.json();
  } catch(e) {
    return { average: 5.0, count: 1 };
  }
}
"""

c = c.replace("""import BioBuilderMock from '@/components/BioBuilderMock';
import FileDropzoneMock from '@/components/FileDropzoneMock';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';""", imports)


# Change Home to async component
c = c.replace('export default function Home() {', 'export default async function Home() {\n  const ratingData = await getRatingSummary();')

# Inject JSON-LD into the head of the page
jsonld = """
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
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
            "ratingValue": ratingData.average.toString(),
            "ratingCount": ratingData.count.toString()
          },
          "description": "Secure file sharing and 3D digital business card generator platform."
        })
      }} />

      <Navbar />"""

c = c.replace('<Navbar />', jsonld, 1)

# Inject the visible star badge into the Hero section so Google can read it
hero_badge = """            <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in-up delay-200">
              One link to rule them all. Share large files securely, generate 3D digital business cards, and shorten URLs—all from a single, unified workspace.
            </p>
            
            {/* SEO Validated Rating Badge */}
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-8 animate-fade-in-up delay-200">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(ratingData.average) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">
                {ratingData.average} / 5.0 <span className="font-normal text-gray-500">({ratingData.count} reviews)</span>
              </span>
            </div>
"""

c = c.replace("""            <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in-up delay-200">
              One link to rule them all. Share large files securely, generate 3D digital business cards, and shorten URLs—all from a single, unified workspace.
            </p>""", hero_badge)


with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Injected real SEO rating into page")
