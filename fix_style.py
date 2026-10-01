import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the entire style block
new_style = """      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { width: 4px; }
        .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hide-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .hide-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); }
        .page { background-color: white; overflow: hidden; }
        .flip-book { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); }

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
          padding-top: 0px;
          padding-right: 6px;
          padding-bottom: 0px;
          font-weight: bold;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }
      `}</style>"""

c = re.sub(r'<style jsx global>\{`.*?`\}<\/style>', new_style, c, flags=re.DOTALL)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
