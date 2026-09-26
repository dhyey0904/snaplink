import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unlock PDF - Remove Password Free | SnapTools',
  description: 'Remove passwords and security restrictions from your PDF files.',
  keywords: ['unlock pdf', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: 'Unlock PDF - Remove Password Free | SnapTools',
    description: 'Remove passwords and security restrictions from your PDF files.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
