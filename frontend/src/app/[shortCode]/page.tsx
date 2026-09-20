import { Metadata } from 'next';
import ClientAdPage from './ClientAdPage';

export async function generateMetadata({ params }: { params: Promise<{ shortCode: string }> }): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  const frontendUrl = "https://www.snaplinks.in";
  
  try {
    const resolvedParams = await params;
    const res = await fetch(`${backendUrl}/${resolvedParams.shortCode}?json=true&no_analytics=true`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      if (data.og_title || data.og_description || data.og_image) {
        let imageUrl = data.og_image;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `${frontendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }

        return {
          title: data.og_title || 'SnapLink',
          description: data.og_description || 'Secure link protected by SnapLink',
          openGraph: {
            title: data.og_title || 'SnapLink',
            description: data.og_description || 'Secure link protected by SnapLink',
            type: 'website',
            siteName: 'SnapLink',
            url: `${frontendUrl}/${resolvedParams.shortCode}`,
            images: imageUrl ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: data.og_title || 'Preview Image',
              }
            ] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: data.og_title || 'SnapLink',
            description: data.og_description || 'Secure link protected by SnapLink',
            images: imageUrl ? [imageUrl] : [],
          }
        };
      }
    }
  } catch (e) {}

  return {
    title: 'SnapLink',
    description: 'Secure link protected by SnapLink'
  };
}

export default function Page({ params }: { params: Promise<any> }) {
  return <ClientAdPage />;
}
