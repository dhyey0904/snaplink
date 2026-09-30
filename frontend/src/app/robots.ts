import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://snaplinks.in';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/about',
        '/features',
        '/pricing',
        '/contact',
        '/privacy',
        '/terms',
        '/cookies',
        '/blog',
        '/tools',
        '/play',
        '/linktree-alternative',
        '/bridge',
        '/url-shortener',
        '/digital-business-card',
        '/file-sharing',
        '/docs',
        '/developers',
        '/templates',
        '/bio/',
        '/v/',
        '/status',
        '/changelog',
        '/security',
        '/help',
      ],
      disallow: [
        '/admin',
        '/dashboard',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/settings',
        '/profile/edit',
        '/billing',
        '/subscription',
        '/notifications',
        '/private',
        '/auth',
        '/api/private',
        '/api/internal',
        '/test',
        '/dev',
        '/staging',
        '/draft',
        '/preview',
        '/temp',
        '/uploads/private',
        '/search',
        '/f/', // Short links redirect tracking
        '/b/' // SnapBridge private transfer rooms
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
