import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';
 
export const runtime = 'edge';
 
export const alt = `${siteConfig.name} - All-in-One Tools`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(to right, #0f172a, ${siteConfig.brandColorLight})`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 100, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 40, color: '#cbd5e1', textAlign: 'center', padding: '0 80px' }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
