import re

with open("frontend/src/app/sitemap.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_sitemap_entry = """    {
      url: `${baseUrl}/tools/pdf-to-jpg`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/protect-pdf`"""

content = content.replace("    {\n      url: `${baseUrl}/tools/protect-pdf`", new_sitemap_entry)

with open("frontend/src/app/sitemap.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Added PDF to JPG to sitemap")
