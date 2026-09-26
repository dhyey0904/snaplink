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

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (!SUPPORTED_CONVERSIONS.includes(params.slug)) {
    return {};
  }
  
  const [from, to] = params.slug.split('-to-');
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

export default function DynamicConversionPage({ params }: { params: { slug: string } }) {
  if (!SUPPORTED_CONVERSIONS.includes(params.slug)) {
    notFound();
  }

  const [from, to] = params.slug.split('-to-');

  return <ClientConverter from={from} to={to} slug={params.slug} />;
}
