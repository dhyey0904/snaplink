import re

with open('frontend/src/app/sitemap.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix link-in-bio
c = c.replace('${baseUrl}/link-in-bio', '${baseUrl}/linktree-alternative')

# Add /bridge
pattern = r"\{ url: `\$\{baseUrl\}\/digital-business-card`, lastModified: new Date\(\), changeFrequency: 'weekly', priority: 0.9 \},"
replacement = "{ url: `${baseUrl}/digital-business-card`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },\n      { url: `${baseUrl}/bridge`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },"

c = re.sub(pattern, replacement, c)

with open('frontend/src/app/sitemap.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated sitemap")
