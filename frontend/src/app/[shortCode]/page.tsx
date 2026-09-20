import { Metadata } from 'next';
import ClientAdPage from './ClientAdPage';

export async function generateMetadata({ params }: { params: Promise<{ shortCode: string }> }): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  
  try {
    const resolvedParams = await params;
    // Pass no_analytics=true so the bot fetch doesn't count as a real human click!
    const res = await fetch(`${backendUrl}/${resolvedParams.shortCode}?json=true&no_analytics=true`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      if (data.og_title || data.og_description || data.og_image) {
        return {
          title: data.og_title || 'SnapLink',
          description: data.og_description || 'Secure link protected by SnapLink',
          openGraph: {
            title: data.og_title || 'SnapLink',
            description: data.og_description || 'Secure link protected by SnapLink',
            images: data.og_image ? [{ url: data.og_image }] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: data.og_title || 'SnapLink',
            description: data.og_description || 'Secure link protected by SnapLink',
            images: data.og_image ? [data.og_image] : [],
          }
        };
      }
    }
  } catch (e) {
    console.error("Metadata fetch error:", e);
  }

  return {
    title: 'SnapLink',
    description: 'Secure link protected by SnapLink'
  };
}

export default function Page({ params }: { params: Promise<any> }) {
  return <ClientAdPage />;
}
