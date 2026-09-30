import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.snaplinks.in';

// Define the different sitemap types we will generate
export async function generateSitemaps() {
  return [
    { id: 'pages' },
    { id: 'tools' },
    { id: 'bio' },
    { id: 'vcard' }
  ];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  
  if (id === 'pages') {
    return [
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
    ];
  }

  if (id === 'tools') {
    return [
      { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/tools/merge-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/tools/split-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/tools/compress-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/tools/image-compressor`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/tools/rotate-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${baseUrl}/tools/protect-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${baseUrl}/tools/unlock-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${baseUrl}/tools/watermark-pdf`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${baseUrl}/tools/pdf-page-numbers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ];
  }

  if (id === 'bio') {
    try {
      // In production, fetch this from the actual FastAPI backend endpoint
      // Example: const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sitemap/bio`);
      // const bios = await res.json();
      const bios = [ { alias: 'demo', updated_at: new Date().toISOString() } ]; // Mock fallback
      
      return bios.map((bio) => ({
        url: `${baseUrl}/bio/${bio.alias}`,
        lastModified: new Date(bio.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    } catch (e) {
      return [];
    }
  }

  if (id === 'vcard') {
    try {
      // Example: const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sitemap/vcard`);
      const vcards = [ { alias: 'demo', updated_at: new Date().toISOString() } ]; // Mock fallback
      
      return vcards.map((vcard) => ({
        url: `${baseUrl}/v/${vcard.alias}`,
        lastModified: new Date(vcard.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    } catch (e) {
      return [];
    }
  }

  return [];
}
