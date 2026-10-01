import os
import json

with open('frontend/src/content/books/earth.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Split long pages manually
new_chapters = []
for chapter in data['chapters']:
    new_pages = []
    for page in chapter['pages']:
        if page['type'] == 'text':
            # split by \n\n
            paragraphs = page['content'].split('\n\n')
            current_page_content = []
            for p in paragraphs:
                current_page_content.append(p)
                # If we have 2 paragraphs, break it into a new page to guarantee no overflow
                if len(current_page_content) == 2:
                    new_pages.append({'content': '\n\n'.join(current_page_content), 'type': 'text'})
                    current_page_content = []
            if current_page_content:
                 new_pages.append({'content': '\n\n'.join(current_page_content), 'type': 'text'})
        else:
            new_pages.append(page)
    chapter['pages'] = new_pages
    new_chapters.append(chapter)

data['chapters'] = new_chapters

with open('frontend/src/content/books/earth.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
