import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SnapLinks',
    short_name: 'SnapLinks',
    description: 'The Ultimate All-in-One Utility Platform. Link Shortener, Link-in-Bio, vCard, PDF Tools, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1557b0',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      }
    ],
  };
}
