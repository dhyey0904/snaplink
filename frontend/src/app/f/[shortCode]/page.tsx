import { Metadata } from 'next';
import ClientFilePage from './ClientFilePage';

export async function generateMetadata({ params }: { params: Promise<{ shortCode: string }> }): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  
  try {
    const resolvedParams = await params;
    const res = await fetch(`${backendUrl}/api/f/${resolvedParams.shortCode}?json=true`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      const title = data.filename ? `Download ${data.filename}` : 'Secure File Transfer';
      const sizeStr = data.size ? ` (${(data.size / 1024 / 1024).toFixed(2)} MB)` : '';
      const description = `Download securely via SnapLink${sizeStr}`;
        
      return {
        title,
        description,
        openGraph: {
          title,
          description,
        },
        twitter: {
          card: 'summary',
          title,
          description,
        }
      };
    }
  } catch (e) {
    console.error("Metadata fetch error:", e);
  }

  return {
    title: 'SnapLink File',
    description: 'Secure File Transfer'
  };
}

export default function Page({ params }: { params: Promise<any> }) {
  return <ClientFilePage />;
}
