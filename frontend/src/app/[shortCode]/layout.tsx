import type { Metadata } from 'next';

type Props = {
  params: { shortCode: string }
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");
  
  try {
    const res = await fetch(`${backendUrl}/${params.shortCode}?json=true&no_analytics=true`, { cache: 'no-store' });
    if (!res.ok) {
      return { title: 'SnapLink Redirect' };
    }
    
    const data = await res.json();
    
    const title = data.og_title || 'SnapLink Redirect';
    const description = data.og_description || 'You have been sent a secure short link via SnapLink.';
    
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        ...(data.og_image && { images: [data.og_image] }),
      },
      twitter: {
        card: data.og_image ? 'summary_large_image' : 'summary',
        title: title,
        description: description,
        ...(data.og_image && { images: [data.og_image] }),
      },
    };
  } catch (e) {
    return { title: 'SnapLink Redirect' };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
