import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF Files Online Free | SnapTools',
  description: 'Extract pages from your PDF or save each page as a separate PDF file.',
  keywords: ['split pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Split PDF Files Online Free | SnapTools',
    description: 'Extract pages from your PDF or save each page as a separate PDF file.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
