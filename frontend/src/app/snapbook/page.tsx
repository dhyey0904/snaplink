import { getBooks } from '@/utils/books';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SnapBook | Interactive Digital Library',
  description: 'Experience knowledge like reading a real premium book. Our interactive digital library offers immersive reading, beautiful typography, and realistic page turns.',
};

export default function SnapBookLibrary() {
  const books = getBooks();
  
  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans selection:bg-[#1a4b3c] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a4b3c] text-white flex items-center justify-center font-serif italic text-xl font-bold shadow-inner">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">SnapBook</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <span className="text-gray-900 cursor-pointer">Library</span>
            <span className="cursor-pointer hover:text-gray-900 transition-colors">Categories</span>
            <span className="cursor-pointer hover:text-gray-900 transition-colors">Collections</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search library..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4b3c]/20 focus:border-[#1a4b3c] w-64 transition-all"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-4 md:px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-serif font-medium text-gray-900 tracking-tight mb-6">
          The future of <span className="italic text-[#1a4b3c]">reading</span>.
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
          Welcome to SnapBook. Not a blog. Not documentation. An interactive digital library designed to make knowledge feel like opening a beautiful, physical book.
        </p>
      </section>

      {/* Library Shelf */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-32">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold text-gray-900">Featured Books</h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Shelf Container */}
        <div className="relative">
          {/* Wood Shelf Backing (Subtle) */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-sm shadow-md z-0 transform translate-y-full"></div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-400 z-0 transform translate-y-[calc(100%+16px)] blur-[1px] opacity-30"></div>
          
          <div className="relative z-10 flex flex-wrap gap-10 lg:gap-16 justify-center md:justify-start items-end pb-2">
            {books.map((book) => (
              <Link href={`/snapbook/${book.slug}`} key={book.slug} className="group relative perspective-1000">
                
                {/* Hover UI Info Card */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 -translate-y-full w-48 bg-white/90 backdrop-blur-md border border-gray-200 p-4 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] transition-all duration-300 pointer-events-none z-30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b3c] mb-1">{book.category}</p>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2">{book.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {book.readingTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      {book.totalPages} p
                    </span>
                  </div>
                </div>

                {/* 3D Book Cover */}
                <div 
                  className="w-[200px] aspect-[1/1.5] rounded-r-xl rounded-l-sm relative transform-style-3d transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:rotate-y-12 group-hover:rotate-z-2 shadow-[2px_4px_12px_rgba(0,0,0,0.15)] group-hover:shadow-[15px_20px_30px_rgba(0,0,0,0.2)] bg-gray-200"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {/* Spine edge */}
                  <div className="absolute left-0 inset-y-0 w-2 bg-black/20 rounded-l-sm z-20 mix-blend-overlay"></div>
                  
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-20 pointer-events-none"></div>

                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-r-xl rounded-l-sm opacity-90 mix-blend-multiply"
                  />
                  
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-20">
                    <div className="text-white drop-shadow-md">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">{book.category}</p>
                      <h3 className="font-serif text-2xl font-bold leading-tight shadow-black">{book.title}</h3>
                      {book.subtitle && <p className="text-sm font-medium opacity-90 mt-1 italic">{book.subtitle}</p>}
                    </div>
                    
                    <div className="text-white drop-shadow-md flex justify-between items-end">
                      <p className="text-xs font-medium opacity-80">{book.author}</p>
                      <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
