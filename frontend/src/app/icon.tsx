import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

// Generate dynamic favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: siteConfig.brandColorLight,
          borderRadius: '128px', // Squircle shape
          color: 'white',
          fontSize: 320,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)',
        }}
      >
        {siteConfig.brandText}
      </div>
    ),
    { ...size }
  );
}
