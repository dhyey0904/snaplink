import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF Online Free | SnapTools',
  description: 'Reduce PDF file size online for free without losing quality. Secure, fast, and browser-based.',
  keywords: ['compress pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Compress PDF Online Free | SnapTools',
    description: 'Reduce PDF file size online for free without losing quality. Secure, fast, and browser-based.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
