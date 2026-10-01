import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate PDF files | SnapLinks',
  description: 'Rotate your PDFs the way you need them. Rotate multiple PDFs at once instantly.',
  openGraph: {
    title: 'Rotate PDF files | SnapLinks',
    description: 'Rotate your PDFs the way you need them. Rotate multiple PDFs at once instantly.',
    url: '/tools/rotate-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
