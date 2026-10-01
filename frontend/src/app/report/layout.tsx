import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report Abuse | SnapLinks',
  description: 'Report malicious links, phishing, or abusive files hosted on SnapLinks.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
