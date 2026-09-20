import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | SnapLink',
  description: 'Insights, tutorials, and news about secure file sharing, digital identity, and modern web tools.',
};

async function getPosts() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/blog'));
  
  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', filename), 'utf-8');
    const { data } = matter(markdownWithMeta);
    return {
      slug,
      frontmatter: data,
    };
  });
  
  return posts.sort((a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf());
}

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-[#202124] tracking-tight mb-4">SnapLink Blog</h1>
          <p className="text-xl text-[#5f6368] max-w-2xl mx-auto">Insights on digital identity, secure sharing, and productivity.</p>
        </div>
        
        <div className="grid gap-8">
          {posts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
              <article className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-3">
                  <time>{new Date(post.frontmatter.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                  <span>•</span>
                  <span>{post.frontmatter.author}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#1a73e8] transition-colors">{post.frontmatter.title}</h2>
                <p className="text-gray-600 leading-relaxed">{post.frontmatter.description}</p>
                <div className="mt-6 flex items-center text-[#1a73e8] font-bold text-sm uppercase tracking-wider">
                  Read Article
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
