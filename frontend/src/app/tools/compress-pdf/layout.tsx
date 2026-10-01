import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF files | SnapLinks',
  description: 'Compress PDF file to get the same PDF quality but less filesize. Optimize your PDFs for web.',
  openGraph: {
    title: 'Compress PDF files | SnapLinks',
    description: 'Compress PDF file to get the same PDF quality but less filesize. Optimize your PDFs for web.',
    url: '/tools/compress-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
