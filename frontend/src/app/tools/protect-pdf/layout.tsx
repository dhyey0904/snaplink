import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protect PDF files | SnapLinks',
  description: 'Encrypt your PDF with a password to keep sensitive data confidential and secure.',
  openGraph: {
    title: 'Protect PDF files | SnapLinks',
    description: 'Encrypt your PDF with a password to keep sensitive data confidential and secure.',
    url: 'https://www.snaplinks.in/tools/protect-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
