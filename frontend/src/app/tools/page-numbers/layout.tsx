import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Page Numbers to PDF | SnapLink',
  description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, and typography.',
  openGraph: {
    title: 'Add Page Numbers to PDF | SnapLink',
    description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, and typography.',
    url: 'https://www.snaplink.in/tools/page-numbers',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
