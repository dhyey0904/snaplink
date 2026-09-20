import { Metadata } from 'next';
import ClientBioPage from './ClientBioPage';

export async function generateMetadata({ params }: { params: Promise<{ alias: string }> }): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  const frontendUrl = "https://www.snaplinks.in";
  
  try {
    const resolvedParams = await params;
    const res = await fetch(`${backendUrl}/api/bio/${resolvedParams.alias}?json=true`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      const title = data.title || 'My Bio Links';
      const description = data.description || 'Check out my links on SnapLink';
      
      let imageUrl = data.avatar_url;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${frontendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
        
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'profile',
          siteName: 'SnapLink',
          url: `${frontendUrl}/bio/${resolvedParams.alias}`,
          images: imageUrl ? [
            {
              url: imageUrl,
              width: 800,
              height: 800,
              alt: title,
            }
          ] : [],
        },
        twitter: {
          card: 'summary',
          title,
          description,
          images: imageUrl ? [imageUrl] : [],
        }
      };
    }
  } catch (e) {}

  return {
    title: 'SnapLink Bio',
    description: 'Check out my links on SnapLink'
  };
}

export default function Page({ params }: { params: Promise<any> }) {
  return <ClientBioPage params={params} />;
}
