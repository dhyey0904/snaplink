import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF files | SnapTools',
  description: 'Combine PDFs in the order you want with the easiest PDF merger available. 100% free and secure.',
  openGraph: {
    title: 'Merge PDF files | SnapTools',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available. 100% free and secure.',
    url: 'https://www.snaplinks.in/tools/merge-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
