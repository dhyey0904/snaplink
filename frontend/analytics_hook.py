import re

with open('e:/snaplink/frontend/src/app/bio/[alias]/BioPageClient.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add view counting
view_effect = '''  useEffect(() => {
    if (bioPage) {
      // Record view
      fetch(`http://localhost:8000/api/bio/public/${bioPage.alias}/view`, { method: 'POST' }).catch(console.error);
    }
  }, [bioPage]);
'''
if 'fetch(`http://localhost:8000/api/bio/public/${bioPage.alias}/view`' not in text:
    text = text.replace('  // Render dynamic style for the background mesh', view_effect + '\n  // Render dynamic style for the background mesh')

# 2. Add click counting for links
click_func = '''  const handleLinkClick = (e: React.MouseEvent, linkId: number, url: string) => {
    e.preventDefault();
    fetch(`http://localhost:8000/api/bio/public/links/${linkId}/click`, { method: 'POST' }).catch(console.error);
    window.open(url, '_blank');
  };
'''
if 'handleLinkClick' not in text:
    text = text.replace('  // Helper to determine the best icon for a URL', click_func + '\n  // Helper to determine the best icon for a URL')

link_find = '''<a href={link.url} target="_blank" key={link.id} className="relative group block w-full mb-4 outline-none">'''
link_replace = '''<a href={link.url} onClick={(e) => handleLinkClick(e, link.id, link.url)} target="_blank" key={link.id} className="relative group block w-full mb-4 outline-none">'''
text = text.replace(link_find, link_replace)

with open('e:/snaplink/frontend/src/app/bio/[alias]/BioPageClient.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Analytics hooked up!")
