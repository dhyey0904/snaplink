import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SnapBridge | Ephemeral Peer-to-Peer File Transfer',
  description: 'Instantly create secure, ephemeral transfer rooms to share files across devices. No account required. Files auto-destruct when the room closes.',
  keywords: ["SnapBridge", "secure file transfer", "ephemeral sharing", "peer to peer", "file drop", "temporary file storage"],
  alternates: {
    canonical: "https://www.snaplinks.in/bridge",
  },
};

export default function BridgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
