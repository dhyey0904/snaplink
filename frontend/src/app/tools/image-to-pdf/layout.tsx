import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image to PDF Converter Free | SnapTools',
  description: 'Convert JPG, PNG, and other images to PDF format instantly in your browser.',
  keywords: ['image to pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Image to PDF Converter Free | SnapTools',
    description: 'Convert JPG, PNG, and other images to PDF format instantly in your browser.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
