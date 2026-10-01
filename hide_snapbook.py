import re
file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<Link href="/snapbook" className="text-sm font-medium text-gray-500 hover:text-black">SnapBook</Link>', '')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

sitemap_file = 'frontend/src/app/sitemap.ts'
with open(sitemap_file, 'r', encoding='utf-8') as f:
    s = f.read()

# I will just remove the snapbook generation block from sitemap.ts
sitemap_block = """  // Add SnapBook URLs
  const booksDirectory = path.join(process.cwd(), 'src', 'content', 'books');
  if (fs.existsSync(booksDirectory)) {
    const filenames = fs.readdirSync(booksDirectory);
    filenames.forEach(filename => {
      if (filename.endsWith('.json') || filename.endsWith('.md')) {
        const slug = filename.replace(/\.json$/, '').replace(/\.md$/, '');
        urls.push({
          url: `${baseUrl}/snapbook/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }"""
s = s.replace(sitemap_block, '')
s = s.replace("urls.push({\n    url: `${baseUrl}/snapbook`,\n    lastModified: new Date(),\n    changeFrequency: 'weekly',\n    priority: 0.8,\n  });", '')

with open(sitemap_file, 'w', encoding='utf-8') as f:
    f.write(s)
