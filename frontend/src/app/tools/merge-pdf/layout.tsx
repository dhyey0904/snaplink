import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online Free | SnapTools',
  description: 'Combine multiple PDFs into a single document easily and securely in your browser.',
  keywords: ['merge pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Merge PDF Files Online Free | SnapTools',
    description: 'Combine multiple PDFs into a single document easily and securely in your browser.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
