import fs from 'fs';
import path from 'path';

export interface BookPage {
  content: string;
  type: 'text' | 'image' | 'interactive';
  caption?: string;
}

export interface BookChapter {
  title: string;
  pages: BookPage[];
}

export interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  edition: string;
  description: string;
  category: string;
  readingTime: string;
  difficulty: string;
  tags: string[];
  coverImage: string;
  coverColor: string;
  chapters: BookChapter[];
  totalPages: number;
}

const BOOKS_DIR = path.join(process.cwd(), 'src/content/books');

export function getBooks(): Book[] {
  if (!fs.existsSync(BOOKS_DIR)) return [];
  
  const files = fs.readdirSync(BOOKS_DIR);
  const books: Book[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const slug = file.replace('.json', '');
      const filePath = path.join(BOOKS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        const data = JSON.parse(content);
        // Calculate total pages
        let totalPages = 0;
        data.chapters?.forEach((c: any) => {
          totalPages += c.pages?.length || 0;
        });
        
        books.push({
          ...data,
          slug,
          totalPages
        });
      } catch (e) {
        console.error(`Error parsing book ${file}`, e);
      }
    }
  }

  return books;
}

export function getBookBySlug(slug: string): Book | null {
  const books = getBooks();
  return books.find(b => b.slug === slug) || null;
}
