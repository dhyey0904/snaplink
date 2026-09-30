import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.snaplinks.in';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/dashboard',
        '/dashboard/',
        '/login',
        '/register',
        '/settings',
        '/auth',
        '/api/',
        '/billing',
        '/private',
        '/search',
        '/f/' // Short links shouldn't be indexed (they redirect)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
