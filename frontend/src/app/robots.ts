import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.snaplinks.in';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/blog',
        '/tools',
        '/play',
        '/linktree-alternative',
        '/bridge',
        '/url-shortener',
        '/digital-business-card',
        '/file-sharing',
        '/bio/',
        '/v/',
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
        '/report',
        '/f/', 
        '/b/' 
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
