import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate PDF Pages Online Free | SnapTools',
  description: 'Rotate specific pages or entire PDF documents permanently and easily.',
  keywords: ['rotate pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Rotate PDF Pages Online Free | SnapTools',
    description: 'Rotate specific pages or entire PDF documents permanently and easily.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
