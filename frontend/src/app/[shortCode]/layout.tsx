import type { Metadata } from 'next';

type Props = {
  params: Promise<{ shortCode: string }>
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
  
  try {
    const res = await fetch(`${backendUrl}/${resolvedParams.shortCode}?json=true&no_analytics=true`, { cache: 'no-store' });
    if (!res.ok) {
      return { title: 'SnapLinks Redirect' };
    }
    
    const data = await res.json();
    
    const title = data.og_title || 'SnapLinks Redirect';
    const description = data.og_description || 'You have been sent a secure short link via SnapLinks.';
    
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
    return { title: 'SnapLinks Redirect' };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
