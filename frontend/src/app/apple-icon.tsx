import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

// Apple Touch Icon standard size
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          color: siteConfig.brandColorLight,
          fontSize: 120,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          border: `8px solid ${siteConfig.brandColorLight}`,
        }}
      >
        {siteConfig.brandText}
      </div>
    ),
    { ...size }
  );
}
