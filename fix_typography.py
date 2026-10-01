import re
file = 'frontend/src/app/snapbook/[slug]/BookReaderClient.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the prose class with custom typography
c = c.replace(
    'className="prose dark:prose-invert max-w-none prose-p:leading-normal pb-8"',
    'className="book-typography pb-8"'
)

# Enhance renderContent to wrap paragraphs in <p> tags instead of just inserting <br/><br/>
new_render_content = """const renderContent = (content: string) => {
    // Convert headers
    let html = content.replace(/# (.*)/g, '<h1 class="book-h1">$1</h1>')
                      .replace(/## (.*)/g, '<h2 class="book-h2">$1</h2>');
    
    // Convert double line breaks into distinct paragraphs
    const paragraphs = html.split(new RegExp('\\\\n\\\\n', 'g'));
    html = paragraphs.map(p => {
       if(p.trim().startsWith('<h')) return p; // Don't wrap headers in p
       return `<p class="book-p">${p}</p>`;
    }).join('');
    
    return html;
  };"""
  
# Find and replace renderContent
c = re.sub(r'const renderContent = \(content: string\) => \{.*?\};', new_render_content, c, flags=re.DOTALL)

# Add CSS rules to the global style block
css_rules = """
        .book-typography {
          width: 100%;
          padding-top: 1rem;
        }
        .book-h1 {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 2rem;
          line-height: 1.2;
          color: inherit;
        }
        .book-h2 {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: inherit;
        }
        .book-p {
          text-align: justify;
          text-justify: inter-word;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          color: inherit;
          opacity: 0.9;
        }
        /* Drop Cap for the first paragraph after an h1 */
        .book-h1 + .book-p::first-letter {
          float: left;
          font-size: 4rem;
          line-height: 0.8;
          padding-top: 4px;
          padding-right: 8px;
          padding-left: 3px;
          font-weight: bold;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }
"""
c = c.replace('.page { background-color: white; overflow: hidden; }', '.page { background-color: white; overflow: hidden; }\n' + css_rules)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
