import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the header actions container
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

header_replace = '''                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <a href={`/bio/${bioPage.alias}`} target="_blank" className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm border border-gray-200 transition-colors flex-1 sm:flex-none min-w-0">
                    <span className="truncate">snaplinks.in/bio/{bioPage.alias}</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                  <button onClick={() => setQrModalUrl(`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/bio/${bioPage.alias}`)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm border border-blue-100 transition-colors flex-shrink-0" title="Share QR">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    <span className="hidden sm:inline">Share QR</span>
                  </button>
                  <button onClick={handleShareLink} className="bg-gray-900 text-white hover:bg-gray-800 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm shadow-sm transition-colors flex-shrink-0" title="Share">
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>'''

text = text.replace(header_find, header_replace)

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Header optimized for mobile!")
