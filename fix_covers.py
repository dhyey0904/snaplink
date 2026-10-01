import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove `showCover={true}` from HTMLFlipBook
c = c.replace('showCover={true}', 'showCover={false}')

# 2. Update the Page structure. 
# We'll prepend an Inside Cover (Left) and a Title Page (Right)
# And append an Inside Back Cover (Left) and Back Cover Flap (Right)
c = c.replace(
"""  const allPages = book.chapters.flatMap((c) => 
    c.pages.map((p) => ({ ...p, chapterTitle: c.title }))
  );
  
  // Pad total pages to be even for the flipbook (so back cover lands on the left side properly)
  if (allPages.length % 2 !== 0) {
    allPages.push({ content: '', type: 'text', chapterTitle: '' });
  }""",
"""  const allPages = [
    { type: 'inside-cover-front', content: '', chapterTitle: '' }, // Left
    { type: 'title-page', content: '', chapterTitle: '' },         // Right
    ...book.chapters.flatMap((c) => 
      c.pages.map((p) => ({ ...p, chapterTitle: c.title }))
    )
  ];
  
  // Pad total pages to be even
  if (allPages.length % 2 !== 0) {
    allPages.push({ content: '', type: 'blank', chapterTitle: '' });
  }
  
  // Add inside back cover and back cover
  allPages.push({ type: 'inside-cover-back', content: '', chapterTitle: '' }); // Left
  allPages.push({ type: 'back-cover-inner', content: '', chapterTitle: '' }); // Right
"""
)

# 3. Update the page rendering logic to handle these new types
c = c.replace(
"""                <div className={`flex-1 overflow-y-auto hide-scrollbar ${getFontClasses()}`}>
                  {page.type === 'text' ? (
                    <div className="prose dark:prose-invert max-w-none prose-p:leading-normal pb-8" dangerouslySetInnerHTML={{ 
                      __html: renderContent(page.content) 
                    }} />
                  ) : page.type === 'image' ? (
                    <div className="h-full flex flex-col items-center justify-center pb-12">
                      <img src={page.content} alt={page.caption} className="max-h-[60vh] object-contain rounded-lg shadow-lg" />
                      {page.caption && <p className="text-sm italic opacity-60 mt-6 text-center">{page.caption}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-30 italic">Blank Page</div>
                  )}
                </div>""",
"""                <div className={`flex-1 overflow-hidden flex flex-col ${getFontClasses()}`}>
                  {page.type === 'text' ? (
                    <div className="book-typography" dangerouslySetInnerHTML={{ 
                      __html: renderContent(page.content) 
                    }} />
                  ) : page.type === 'image' ? (
                    <div className="flex-1 flex flex-col items-center justify-center pb-8">
                      <img src={page.content} alt={page.caption} className="max-h-[60vh] object-contain rounded-lg shadow-md" />
                      {page.caption && <p className="text-xs italic opacity-60 mt-4 text-center px-4">{page.caption}</p>}
                    </div>
                  ) : page.type === 'inside-cover-front' ? (
                    <div className="absolute inset-0 bg-[#1a4b3c] opacity-10"></div>
                  ) : page.type === 'inside-cover-back' ? (
                    <div className="absolute inset-0 bg-[#1a4b3c] opacity-10"></div>
                  ) : page.type === 'title-page' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                       <h1 className="text-4xl font-serif font-bold mb-4">{book.title}</h1>
                       <p className="text-xl italic opacity-70 mb-12">{book.subtitle}</p>
                       <p className="text-sm uppercase tracking-widest font-bold opacity-50">{book.author}</p>
                       <p className="text-xs opacity-40 mt-2">{book.edition}</p>
                    </div>
                  ) : page.type === 'back-cover-inner' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 opacity-40">
                       <h1 className="text-xl font-serif font-bold mb-2">SnapBook</h1>
                       <p className="text-xs">The End</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-10 italic text-sm">Blank</div>
                  )}
                </div>"""
)

# 4. Remove PageCover component entirely as we don't need it inside the flipbook anymore
c = re.sub(r'// Hard Cover \(Front and Back\).*?PageCover\.displayName = \'PageCover\';', '', c, flags=re.DOTALL)

# 5. Remove Front and Back Cover invocations inside HTMLFlipBook
c = re.sub(r'\{\/\* Front Cover \*\/}.*?<PageCover book=\{book\} side="front" \/>', '', c, flags=re.DOTALL)
c = re.sub(r'\{\/\* Back Cover \*\/}.*?<PageCover book=\{book\} side="back" \/>', '', c, flags=re.DOTALL)

# 6. Fix CSS Typography (remove text-justify, fix drop cap, fix font sizes)
new_css = """
        .book-typography {
          width: 100%;
          height: 100%;
        }
        .book-h1 {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: inherit;
        }
        .book-h2 {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: inherit;
        }
        .book-p {
          text-align: left;
          line-height: 1.7;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          color: inherit;
          opacity: 0.85;
        }
        .book-h1 + .book-p::first-letter {
          float: left;
          font-size: 3.5rem;
          line-height: 1;
          padding-top: 4px;
          padding-right: 8px;
          padding-bottom: 4px;
          font-weight: bold;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }
"""
c = re.sub(r'\.book-typography \{.*\}\n', new_css, c, flags=re.DOTALL)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
