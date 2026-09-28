import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watermark PDF | SnapLink',
  description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
  openGraph: {
    title: 'Watermark PDF | SnapLink',
    description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
    url: 'https://www.snaplink.in/tools/watermark-pdf',
  }
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
