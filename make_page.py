import os

content = """import { getBookBySlug, getBooks } from '@/utils/books';
import { notFound } from 'next/navigation';
import BookReaderClient from './BookReaderClient';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const books = getBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const book = getBookBySlug(params.slug);
  if (!book) return { title: 'Not Found' };
  
  return {
    title: `${book.title} | SnapBook`,
    description: book.description,
    openGraph: {
      title: `${book.title} | SnapBook`,
      description: book.description,
      images: [book.coverImage],
    }
  };
}

export default function SnapBookPage({ params }: { params: { slug: string } }) {
  const book = getBookBySlug(params.slug);
  
  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans selection:bg-[#1a4b3c] selection:text-white">
      <BookReaderClient book={book} />
    </div>
  );
}"""

with open(r'frontend/src/app/snapbook/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
