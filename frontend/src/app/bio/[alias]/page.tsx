import { Metadata } from 'next';
import ClientBioPage from './ClientBioPage';

export async function generateMetadata({ params }: { params: Promise<{ alias: string }> }): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  
  try {
    const resolvedParams = await params;
    const res = await fetch(`${backendUrl}/api/bio/${resolvedParams.alias}?json=true`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      const title = data.title || 'My Bio Links';
      const description = data.description || 'Check out my links on SnapLink';
        
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: data.avatar_url ? [{ url: data.avatar_url }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: data.avatar_url ? [data.avatar_url] : [],
        }
      };
    }
  } catch (e) {
    console.error("Metadata fetch error:", e);
  }

  return {
    title: 'SnapLink Bio',
    description: 'Check out my links on SnapLink'
  };
}

export default function Page({ params }: { params: Promise<any> }) {
  return <ClientBioPage params={params} />;
}
