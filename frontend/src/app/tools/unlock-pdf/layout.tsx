import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unlock PDF files | SnapLink',
  description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
  openGraph: {
    title: 'Unlock PDF files | SnapLink',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
    url: 'https://www.snaplink.in/tools/unlock-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
