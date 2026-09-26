import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to JPG Online Free | SnapTools',
  description: 'Extract images from PDF or convert PDF pages to high-quality JPG images.',
  keywords: ['pdf to jpg', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Convert PDF to JPG Online Free | SnapTools',
    description: 'Extract images from PDF or convert PDF pages to high-quality JPG images.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
