import os
import json

with open('frontend/src/content/books/earth.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Split long pages manually to 1 paragraph
new_chapters = []
for chapter in data['chapters']:
    new_pages = []
    for page in chapter['pages']:
        if page['type'] == 'text':
            paragraphs = page['content'].split('\n\n')
            for p in paragraphs:
                if p.strip():
                    new_pages.append({'content': p, 'type': 'text'})
        else:
            new_pages.append(page)
    chapter['pages'] = new_pages
    new_chapters.append(chapter)

data['chapters'] = new_chapters

with open('frontend/src/content/books/earth.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
