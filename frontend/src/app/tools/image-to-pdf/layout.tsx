import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG to PDF | SnapLinks',
  description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins for your document.',
  openGraph: {
    title: 'JPG to PDF | SnapLinks',
    description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins for your document.',
    url: 'https://www.snaplinks.in/tools/image-to-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
