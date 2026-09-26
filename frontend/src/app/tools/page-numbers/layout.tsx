import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Page Numbers to PDF Free | SnapTools',
  description: 'Easily insert page numbers into your PDF documents for free.',
  keywords: ['page numbers', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Add Page Numbers to PDF Free | SnapTools',
    description: 'Easily insert page numbers into your PDF documents for free.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
