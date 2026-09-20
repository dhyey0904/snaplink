import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: any) {
  const resolvedParams = await params;
  const markdownWithMeta = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', resolvedParams.slug + '.md'), 'utf-8');
  const { data } = matter(markdownWithMeta);
  return {
    title: `${data.title} | SnapLink Blog`,
    description: data.description,
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/blog'));
  return files.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));
}

export default async function BlogPost({ params }: any) {
  const resolvedParams = await params;
  const markdownWithMeta = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', resolvedParams.slug + '.md'), 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 uppercase tracking-wider">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Blog
          </Link>

          <header className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">{frontmatter.title}</h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 font-medium">
              <span>{new Date(frontmatter.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>By {frontmatter.author}</span>
            </div>
          </header>

          <article className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#1a73e8] prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
