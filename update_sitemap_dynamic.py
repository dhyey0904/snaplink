import re

with open("frontend/src/app/sitemap.ts", "r", encoding="utf-8") as f:
    content = f.read()

slugs = [
  'jpg-to-png', 'jpg-to-webp',
  'png-to-jpg', 'png-to-webp',
  'webp-to-jpg', 'webp-to-png',
  'bmp-to-jpg', 'bmp-to-png',
  'svg-to-png', 'svg-to-jpg',
  'avif-to-jpg', 'avif-to-png',
  'gif-to-png'
]

new_entries = ""
for slug in slugs:
    new_entries += f"""    {{
      url: `${{baseUrl}}/tools/{slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }},\n"""

# Insert right before the end
content = content.replace("  ]\n}", new_entries + "  ]\n}")

with open("frontend/src/app/sitemap.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Added dynamic tools to sitemap")
