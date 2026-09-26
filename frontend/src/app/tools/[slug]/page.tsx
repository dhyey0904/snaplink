import React from 'react';
import { notFound } from 'next/navigation';
import ClientConverter from './ClientConverter';
import { Metadata } from 'next';

// Define the supported conversions
const SUPPORTED_CONVERSIONS = [
  'jpg-to-png', 'jpg-to-webp',
  'png-to-jpg', 'png-to-webp',
  'webp-to-jpg', 'webp-to-png',
  'bmp-to-jpg', 'bmp-to-png',
  'svg-to-png', 'svg-to-jpg',
  'avif-to-jpg', 'avif-to-png',
  'gif-to-png'
];

export function generateStaticParams() {
  return SUPPORTED_CONVERSIONS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  if (!SUPPORTED_CONVERSIONS.includes(resolvedParams.slug)) {
    return {};
  }
  
  const [from, to] = resolvedParams.slug.split('-to-');
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  
  return {
    title: `${fromUpper} to ${toUpper} Converter | Free SnapTools`,
    description: `Convert ${fromUpper} images to ${toUpper} format instantly in your browser. 100% free, secure, and lightning fast.`,
    keywords: [`${fromUpper} to ${toUpper}`, `convert ${fromUpper}`, `${toUpper} converter`, "SnapTools", "image converter"],
    openGraph: {
      title: `Convert ${fromUpper} to ${toUpper} Instantly`,
      description: `Free, secure, and fast ${fromUpper} to ${toUpper} converter.`,
    }
  };
}

export default async function DynamicConversionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  if (!SUPPORTED_CONVERSIONS.includes(resolvedParams.slug)) {
    notFound();
  }

  const [from, to] = resolvedParams.slug.split('-to-');

  return <ClientConverter from={from} to={to} slug={resolvedParams.slug} />;
}
