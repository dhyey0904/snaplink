import re

with open("frontend/src/app/sitemap.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_sitemap_entry = """    {
      url: `${baseUrl}/tools/image-to-pdf`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/merge-pdf`"""

content = content.replace("    {\n      url: `${baseUrl}/tools/merge-pdf`", new_sitemap_entry)

with open("frontend/src/app/sitemap.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Added Image to PDF to sitemap")
