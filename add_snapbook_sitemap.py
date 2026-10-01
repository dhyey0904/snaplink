import re

file = 'frontend/src/app/sitemap.ts'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

if '/snapbook' not in c:
    c = c.replace(
        "const routes = [",
        "const routes = [\n    { url: `${baseUrl}/snapbook`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },"
    )
    
    # Also fetch books for sitemap
    c = c.replace(
        "try {",
        "try {\n    // Fetch SnapBooks locally\n    const fs = require('fs');\n    const path = require('path');\n    try { const booksDir = path.join(process.cwd(), 'src/content/books'); if (fs.existsSync(booksDir)) { fs.readdirSync(booksDir).forEach((file: string) => { if (file.endsWith('.json')) { routes.push({ url: `${baseUrl}/snapbook/${file.replace('.json', '')}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 }); } }); } } catch (e) {}\n"
    )
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)
