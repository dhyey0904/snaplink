import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Watermark to PDF Free | SnapTools',
  description: 'Stamp text or image watermarks onto your PDF documents instantly.',
  keywords: ['watermark pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Add Watermark to PDF Free | SnapTools',
    description: 'Stamp text or image watermarks onto your PDF documents instantly.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
