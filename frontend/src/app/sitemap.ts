import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.snaplinks.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/play`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/url-shortener`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/file-sharing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/linktree-alternative`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/digital-business-card`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/bridge`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools/merge-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/split-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/compress-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/image-compressor`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/rotate-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/tools/protect-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/tools/unlock-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/tools/watermark-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/tools/page-numbers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Try to fetch dynamic routes (Bios and vCards) from backend, but fail gracefully if offline
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com';
    
    // Fetch bios
    try {
      const bioRes = await fetch(`${backendUrl}/api/sitemap/bio`, { next: { revalidate: 3600 } });
      if (bioRes.ok) {
        const bios = await bioRes.json();
        bios.forEach((b: any) => {
          routes.push({
            url: `${baseUrl}/bio/${b.alias}`,
            lastModified: new Date(b.updated_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    } catch (e) {}

    // Fetch vcards
    try {
      const vcardRes = await fetch(`${backendUrl}/api/sitemap/vcard`, { next: { revalidate: 3600 } });
      if (vcardRes.ok) {
        const vcards = await vcardRes.json();
        vcards.forEach((v: any) => {
          routes.push({
            url: `${baseUrl}/v/${v.alias}`,
            lastModified: new Date(v.updated_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    } catch (e) {}
  } catch (e) {}

  return routes as MetadataRoute.Sitemap;
}
