import { getBookBySlug, getBooks } from '@/utils/books';
import { notFound } from 'next/navigation';
import BookReaderClient from './BookReaderClient';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const books = getBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const book = getBookBySlug(resolvedParams.slug);
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

export default async function SnapBookPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const book = getBookBySlug(resolvedParams.slug);
  
  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans selection:bg-[#1a4b3c] selection:text-white">
      <BookReaderClient book={book} />
    </div>
  );
}