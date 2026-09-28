import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/f/', '/api/', '/reset-password'],
    },
    sitemap: 'https://www.snaplinks.in/sitemap.xml',
  }
}
