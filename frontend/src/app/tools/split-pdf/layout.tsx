import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF file | SnapLink',
  description: 'Split a PDF file by page ranges or extract all PDF pages to multiple PDF files effortlessly.',
  openGraph: {
    title: 'Split PDF file | SnapLink',
    description: 'Split a PDF file by page ranges or extract all PDF pages to multiple PDF files effortlessly.',
    url: 'https://www.snaplink.in/tools/split-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
