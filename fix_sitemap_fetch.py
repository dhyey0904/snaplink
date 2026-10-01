import re

file = 'frontend/src/app/sitemap.ts'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add AbortController to sitemap fetches
old_sitemap = """  // Try to fetch dynamic routes (Bios and vCards) from backend, but fail gracefully if offline
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
  } catch (e) {}"""

new_sitemap = """  // Try to fetch dynamic routes (Bios and vCards) from backend, but fail gracefully if offline
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    // Fetch bios
    try {
      const bioRes = await fetch(`${backendUrl}/api/sitemap/bio`, { 
        next: { revalidate: 3600 },
        signal: controller.signal
      });
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
      const vcardRes = await fetch(`${backendUrl}/api/sitemap/vcard`, { 
        next: { revalidate: 3600 },
        signal: controller.signal
      });
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
    
    clearTimeout(timeoutId);
  } catch (e) {}"""

c = c.replace(old_sitemap, new_sitemap)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added timeout to sitemap fetch")
