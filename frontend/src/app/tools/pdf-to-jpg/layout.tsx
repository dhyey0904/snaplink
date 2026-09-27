import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to JPG | SnapTools',
  description: 'Extract all images contained in a PDF or convert each page to a JPG file instantly.',
  openGraph: {
    title: 'PDF to JPG | SnapTools',
    description: 'Extract all images contained in a PDF or convert each page to a JPG file instantly.',
    url: 'https://www.snaplinks.in/tools/pdf-to-jpg',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
