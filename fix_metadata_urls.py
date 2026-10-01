import os
import re

app_dir = "frontend/src/app"

def clean_metadata(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find https://www.snaplinks.in or https://snaplinks.in and replace it with just the path
    # e.g., url: 'https://www.snaplinks.in/tools/compress-pdf' -> url: '/tools/compress-pdf'
    
    # We will use a regex to match the base url and capture the path
    pattern = r'(url:\s*[\'"])https?://(?:www\.)?snaplinks\.in(/.*?)?([\'"])'
    content = re.sub(pattern, r'\1\2\3', content)
    
    # Same for canonical
    pattern_canonical = r'(canonical:\s*[\'"])https?://(?:www\.)?snaplinks\.in(/.*?)?([\'"])'
    content = re.sub(pattern_canonical, r'\1\2\3', content)
    
    # Same for author url
    pattern_author = r'(url:\s*[\'"])https?://(?:www\.)?snaplinks\.in/?([\'"])'
    content = re.sub(pattern_author, r'\1/\2', content)

    # Clean up empty strings or single slashes if any got mangled
    content = content.replace("url: ''", "url: '/'")
    content = content.replace("url: \"\"", "url: '/'")
    content = content.replace("canonical: ''", "canonical: '/'")
    content = content.replace("canonical: \"\"", "canonical: '/'")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

for root, _, files in os.walk(app_dir):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts"):
            clean_metadata(os.path.join(root, f))
            
print("Cleaned up hardcoded metadata URLs")
