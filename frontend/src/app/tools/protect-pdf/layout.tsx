import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protect PDF with Password Free | SnapTools',
  description: 'Encrypt your PDF files with AES-256 password protection to secure your sensitive data.',
  keywords: ['protect pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Protect PDF with Password Free | SnapTools',
    description: 'Encrypt your PDF files with AES-256 password protection to secure your sensitive data.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
