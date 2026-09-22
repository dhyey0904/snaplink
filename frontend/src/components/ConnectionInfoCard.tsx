import React from 'react';
import QRCode from 'react-qr-code';


interface Props {
  activeFile: any | null;
  timeLeft: string | null;
  handleShare: () => void;
  handleDelete: (id: number) => void;
  handleCopy: (text: string) => void;
  SHORT_LINK_DOMAIN: string;
}

export default function ConnectionInfoCard({ activeFile, timeLeft, handleShare, handleDelete, handleCopy, SHORT_LINK_DOMAIN }: Props) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative w-full h-full">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative">
        <div className="absolute top-4 left-4">
          <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </div>
        <h3 className="text-2xl font-bold ml-10">Connection Info</h3>
        <p className="text-blue-100 ml-10 mt-1">Scan or connect to share files</p>
      </div>

      <div className="p-8">
        {activeFile ? (
          <>
            {timeLeft && (
              <div className="flex items-center justify-center gap-2 mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold tracking-wider">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Expires in: {timeLeft}
              </div>
            )}

            {activeFile.has_password && (
              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                  Secure PIN
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={activeFile.password || ""}
                    className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-900 font-bold tracking-[0.2em] text-center outline-none text-gray-900 placeholder-gray-600"
                  />
                  {activeFile.password && activeFile.password.length === 6 && (
                    <button 
                      onClick={() => handleCopy(activeFile.password!)}
                      className="bg-amber-100 text-amber-700 w-12 rounded-xl flex items-center justify-center hover:bg-amber-200 transition-colors flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-lg inline-block">
                <QRCode value={`${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`} size={220} />
              </div>
            </div>
            <p className="text-center text-gray-500 font-medium mb-8">Scan to connect instantly</p>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={handleShare}
                className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                Share File
              </button>
              <button 
                onClick={() => handleDelete(activeFile.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Delete Now
              </button>
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3  font-medium outline-none truncate text-gray-900 placeholder-gray-600"
                  />
                  <button 
                    onClick={() => handleCopy(`${SHORT_LINK_DOMAIN}f/${activeFile.short_code}`)}
                    className="bg-blue-50 text-blue-600 w-12 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            <p className="text-gray-400 font-medium">Upload a file to generate connection info</p>
          </div>
        )}
      </div>
    </div>
  );
}
