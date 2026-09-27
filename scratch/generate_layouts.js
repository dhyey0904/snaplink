const fs = require('fs');
const path = require('path');

const toolsDir = path.join('E:/snaplink/frontend/src/app/tools');

const toolMeta = {
  'compress-pdf': { title: 'Compress PDF Online Free | SnapTools', desc: 'Reduce PDF file size online for free without losing quality. Secure, fast, and browser-based.' },
  'image-to-pdf': { title: 'Image to PDF Converter Free | SnapTools', desc: 'Convert JPG, PNG, and other images to PDF format instantly in your browser.' },
  'merge-pdf': { title: 'Merge PDF Files Online Free | SnapTools', desc: 'Combine multiple PDFs into a single document easily and securely in your browser.' },
  'page-numbers': { title: 'Add Page Numbers to PDF Free | SnapTools', desc: 'Easily insert page numbers into your PDF documents for free.' },
  'pdf-to-jpg': { title: 'Convert PDF to JPG Online Free | SnapTools', desc: 'Extract images from PDF or convert PDF pages to high-quality JPG images.' },
  'protect-pdf': { title: 'Protect PDF with Password Free | SnapTools', desc: 'Encrypt your PDF files with AES-256 password protection to secure your sensitive data.' },
  'rotate-pdf': { title: 'Rotate PDF Pages Online Free | SnapTools', desc: 'Rotate specific pages or entire PDF documents permanently and easily.' },
  'split-pdf': { title: 'Split PDF Files Online Free | SnapTools', desc: 'Extract pages from your PDF or save each page as a separate PDF file.' },
  'unlock-pdf': { title: 'Unlock PDF - Remove Password Free | SnapTools', desc: 'Remove passwords and security restrictions from your PDF files.' },
  'watermark-pdf': { title: 'Add Watermark to PDF Free | SnapTools', desc: 'Stamp text or image watermarks onto your PDF documents instantly.' }
};

for (const [folder, meta] of Object.entries(toolMeta)) {
  const dirPath = path.join(toolsDir, folder);
  if (fs.existsSync(dirPath)) {
    const layoutPath = path.join(dirPath, 'layout.tsx');
    const content = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${meta.title}',
  description: '${meta.desc}',
  keywords: ['${folder.replace(/-/g, ' ')}', 'free', 'SnapTools', 'online', 'pdf tool'],
  openGraph: {
    title: '${meta.title}',
    description: '${meta.desc}',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
    fs.writeFileSync(layoutPath, content, 'utf8');
    console.log('Created layout for', folder);
  }
}
