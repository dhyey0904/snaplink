import { Metadata } from 'next';
import ClientVCardPage from './ClientVCardPage';

export async function generateMetadata({ params }: { params: { alias: string } }): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  
  try {
    const res = await fetch(`${backendUrl}/api/vcard/${params.alias}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      const title = data.name ? `${data.name} - Digital vCard` : 'SnapLink Digital vCard';
      const description = data.job_title 
        ? `${data.job_title}${data.company ? ` at ${data.company}` : ''}`
        : 'View my 3D Digital vCard on SnapLink';
        
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: data.headshot_url ? [{ url: data.headshot_url }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: data.headshot_url ? [data.headshot_url] : [],
        }
      };
    }
  } catch (e) {
    console.error("Metadata fetch error:", e);
  }

  return {
    title: 'SnapLink Digital vCard',
    description: 'View my 3D Digital vCard'
  };
}

export default function Page() {
  return <ClientVCardPage />;
}
