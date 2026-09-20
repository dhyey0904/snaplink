import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add isMobilePreviewOpen state
if 'const [isMobilePreviewOpen' not in text:
    text = text.replace('const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);', 
                       'const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);\n  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);')


# 2. Add handleToggleLink function
toggle_func = '''  const handleToggleLink = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:8000/api/bio/links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) fetchBioPage();
    } catch (err) {
      console.error('Failed to toggle link');
    }
  };
'''
if 'handleToggleLink' not in text:
    text = text.replace('const handleDeleteLink =', toggle_func + '\n  const handleDeleteLink =')

# 3. Optimize Header (QR Icon for mobile)
header_find = '''                <div className="flex flex-wrap items-center gap-3">
                  <a href={`/bio/${bioPage.alias}`} target="_blank" className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm border border-gray-200 transition-colors">
                    snaplinks.in/bio/{bioPage.alias}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                  <button onClick={() => setQrModalUrl(`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/bio/${bioPage.alias}`)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm border border-blue-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    Share QR
                  </button>
                  <button onClick={handleShareLink} className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm shadow-sm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    Share
                  </button>
                </div>'''

header_replace = '''                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a href={`/bio/${bioPage.alias}`} target="_blank" className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm border border-gray-200 transition-colors flex-1 sm:flex-none justify-center truncate">
                    <span className="truncate">snaplinks.in/bio/{bioPage.alias}</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                  <button onClick={() => setQrModalUrl(`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/bio/${bioPage.alias}`)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm border border-blue-100 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    <span className="hidden sm:inline">Share QR</span>
                  </button>
                  <button onClick={handleShareLink} className="bg-gray-900 text-white hover:bg-gray-800 px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm shadow-sm transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>'''
text = text.replace(header_find, header_replace)

# 4. Scrollable tabs + remove Live Preview tab
tabs_find = '''                <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 inline-flex self-start overflow-x-auto max-w-full hide-scrollbar">
                  <button onClick={() => setActiveTab('links')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'links' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Links</button>
                  <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Profile Settings</button>
                  <button onClick={() => setActiveTab('appearance')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'appearance' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Appearance</button>
                  <button onClick={() => setActiveTab('preview')} className={`lg:hidden px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'preview' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Live Preview</button>
                </div>'''

tabs_replace = '''                <div className="relative mb-8 self-start w-full sm:w-auto overflow-hidden rounded-2xl">
                  <div className="flex gap-2 bg-white p-1.5 shadow-sm border border-gray-200 inline-flex overflow-x-auto max-w-full hide-scrollbar w-full sm:w-auto relative z-10">
                    <button onClick={() => setActiveTab('links')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'links' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                      <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                      Links
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                      <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      Profile
                    </button>
                    <button onClick={() => setActiveTab('appearance')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'appearance' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                      <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                      Appearance
                    </button>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent sm:hidden pointer-events-none z-20"></div>
                </div>'''
text = text.replace(tabs_find, tabs_replace)

# 5. Fix Left Column logic (since 'preview' tab is removed)
text = text.replace("className={`lg:col-span-7 xl:col-span-8 flex-col ${activeTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}", 
                   "className={`lg:col-span-7 xl:col-span-8 flex-col flex`}")

# 6. Button Alignment (Add Block)
add_find = '''                        <button onClick={() => handleAddLink(newLinkType)} className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">'''
add_replace = '''                        <button onClick={() => handleAddLink(newLinkType)} className="w-full px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">'''
text = text.replace(add_find, add_replace)

title_find = '''<h2 className="text-xl font-bold text-gray-900">Add New Link</h2>'''
title_replace = '''<h2 className="text-xl font-bold text-gray-900">Add New Block</h2>'''
text = text.replace(title_find, title_replace)

# 7. Link Card Toggles & Analytics
card_actions_find = '''                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteLink(link.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>'''

card_actions_replace = '''                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1" title="Clicks">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            {link.clicks || 0}
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer" title="Toggle Visibility">
                          <input type="checkbox" className="sr-only peer" checked={link.is_active !== false} onChange={() => handleToggleLink(link.id, link.is_active !== false)} />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        </label>
                        <button onClick={() => handleDeleteLink(link.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>'''
text = text.replace(card_actions_find, card_actions_replace)


with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("page.tsx part 1 applied")
