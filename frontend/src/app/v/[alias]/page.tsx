import { Metadata } from 'next';
import ClientVCardPage from './ClientVCardPage';

export async function generateMetadata({ params }: { params: Promise<{ alias: string }> }): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  const frontendUrl = "https://www.snaplinks.in";
  
  try {
    const resolvedParams = await params;
    const res = await fetch(`${backendUrl}/api/vcard/${resolvedParams.alias}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      const title = data.name ? `${data.name} - Digital vCard` : 'SnapLink Digital vCard';
      const description = data.job_title 
        ? `${data.job_title}${data.company ? ` at ${data.company}` : ''}`
        : 'View my 3D Digital vCard on SnapLink';
        
      let imageUrl = data.headshot_url || data.logo_url;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'profile',
          siteName: 'SnapLink',
          url: `${frontendUrl}/v/${resolvedParams.alias}`,
          images: imageUrl ? [
            {
              url: imageUrl,
              width: 800,
              height: 800,
              alt: data.name || 'Profile Image',
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
    title: 'SnapLink Digital vCard',
    description: 'View my 3D Digital vCard'
  };
}

export default function Page({ params }: { params: Promise<any> }) {
  return <ClientVCardPage />;
}
