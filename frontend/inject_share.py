import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Insert the handleShareLink function
share_func = '''
  const handleShareLink = async () => {
    if (!bioPage) return;
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/bio/${bioPage.alias}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'My Bio Page',
          text: bioText || 'Check out my links!',
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };
'''

if 'const handleShareLink =' not in text:
    text = text.replace('const handleDownloadQR =', share_func + '\n  const handleDownloadQR =')

# Insert the button
button_block = '''
                  <button onClick={handleShareLink} className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm shadow-sm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    Share
                  </button>
                </div>'''

text = re.sub(r'Share QR\s*</button>\s*</div>', r'Share QR\n                  </button>' + '\n' + button_block, text)

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Added share button successfully")
