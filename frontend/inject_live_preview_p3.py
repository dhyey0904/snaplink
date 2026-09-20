import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

themes_code = '''
  const themes: Record<string, any> = {
    'dark-glass': {
      bg: 'bg-[#0a0a0f]',
      text: 'text-white',
      textSec: 'text-[#b0a8c2]',
      textMuted: 'text-white/40',
      linkBg: 'bg-white/[0.03] border border-white/[0.05] shadow-lg',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/40 font-medium',
      iconBg: 'bg-white/5 border border-white/10 text-white',
      featuredClass: 'bg-gradient-to-r from-[#ff4b72] to-[#8b2cff] shadow-lg text-white',
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#0a0a0f]',
      showMesh: true,
      socialBg: 'bg-white/[0.04] border-white/[0.08] text-white',
    },
    'light-glass': {
      bg: 'bg-[#f8f9fa]',
      text: 'text-gray-900',
      textSec: 'text-gray-600',
      textMuted: 'text-gray-400',
      linkBg: 'bg-white/60 border border-white shadow-md',
      linkText: 'text-gray-900 font-bold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-white border border-gray-100 text-gray-900 shadow-sm',
      featuredClass: `bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg text-white`,
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#f8f9fa]',
      showMesh: true,
      socialBg: 'bg-white border-gray-200 text-gray-700 shadow-sm',
    },
    'solid': {
      bg: '', 
      text: 'text-white',
      textSec: 'text-white/90',
      textMuted: 'text-white/60',
      linkBg: 'bg-black/10 border border-transparent shadow-sm',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/70 font-medium',
      iconBg: 'bg-black/20 text-white',
      featuredClass: 'bg-white text-black shadow-lg',
      featuredIconBg: 'bg-black/10 text-black',
      profileBg: 'transparent',
      showMesh: false,
      socialBg: 'bg-black/10 text-white border-transparent',
    },
    'neo-brutalism': {
      bg: 'bg-[#FDF9F1]',
      text: 'text-black',
      textSec: 'text-black',
      textMuted: 'text-gray-700',
      linkBg: 'bg-white border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none',
      linkText: 'text-black font-black uppercase tracking-tight',
      linkSub: 'text-gray-800 font-bold',
      iconBg: 'bg-[#FFEB3B] border-2 border-black text-black rounded-none',
      featuredClass: 'bg-[#FF90E8] border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none text-black',
      featuredIconBg: 'bg-white border-2 border-black text-black rounded-none',
      profileBg: 'bg-[#FDF9F1]',
      showMesh: false,
      socialBg: 'bg-white border-2 border-black text-black',
    },
    'minimal': {
      bg: 'bg-white',
      text: 'text-gray-900',
      textSec: 'text-gray-500',
      textMuted: 'text-gray-400',
      linkBg: 'bg-transparent border border-gray-200 rounded-lg',
      linkText: 'text-gray-900 font-semibold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-gray-50 text-gray-700 border-none rounded-lg',
      featuredClass: 'bg-gray-900 text-white rounded-lg',
      featuredIconBg: 'bg-white/20 text-white rounded-lg',
      profileBg: 'bg-white',
      showMesh: false,
      socialBg: 'bg-transparent border border-gray-200 text-gray-700 rounded-full',
    }
  };

  const t = themes[themeType] || themes['dark-glass'];
'''

if "const t = themes[themeType]" not in text:
    text = text.replace('const [adEnabled, setAdEnabled] = useState(true);', 'const [adEnabled, setAdEnabled] = useState(true);\n' + themes_code)

start_marker = '{/* Scrollable Content inside Screen */}'
end_marker = '                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          )}'

live_preview_code = '''{/* Scrollable Content inside Screen */}
                      <div className={`flex-1 overflow-y-auto hide-scrollbar flex flex-col pt-12 relative z-10 ${t.bg}`} style={themeType === 'solid' ? { backgroundColor: themeColor } : {}}>
                        
                        {/* Mesh background */}
                        {t.showMesh && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            {themeType === 'dark-glass' ? (
                              <>
                                <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[50%] rounded-full blur-[60px] opacity-40 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                                <div className="absolute top-[20%] right-[-20%] w-[150%] h-[50%] rounded-full blur-[80px] opacity-30 mix-blend-screen" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
                              </>
                            ) : (
                              <>
                                <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[50%] rounded-full blur-[60px] opacity-[0.15] mix-blend-multiply" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                                <div className="absolute top-[20%] right-[-20%] w-[150%] h-[50%] rounded-full blur-[80px] opacity-[0.15] mix-blend-multiply" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
                              </>
                            )}
                          </div>
                        )}

                        <div className="w-full z-10 flex flex-col items-center px-4 pb-8">
                          
                          <div className="relative mb-3 mt-2">
                            {themeType === 'dark-glass' && (
                              <div className="absolute -inset-[2px] rounded-full bg-gradient-to-tr from-[#ff6b6b] via-[#c0392b] to-[#8e44ad] p-[2px] shadow-sm">
                                <div className="w-full h-full bg-[#0a0a0f] rounded-full"></div>
                              </div>
                            )}
                            <div className="relative">
                              {profileImageUrl ? (
                                <img src={profileImageUrl} alt="Profile" className={`w-[80px] h-[80px] rounded-full object-cover border ${themeType === 'neo-brutalism' ? 'border-2 border-black rounded-none shadow-[2px_2px_0_0_#000]' : 'border-transparent'}`} style={themeType !== 'neo-brutalism' ? { borderColor: t.profileBg } : {}} />
                              ) : (
                                <div className={`w-[80px] h-[80px] flex items-center justify-center text-3xl font-black ${themeType === 'neo-brutalism' ? 'border-2 border-black bg-[#FF90E8] text-black shadow-[2px_2px_0_0_#000]' : 'rounded-full bg-gray-200 text-gray-500'}`} style={themeType !== 'neo-brutalism' && !t.bg.includes('white') ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } : {}}>
                                  {title.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>

                          <h2 className={`font-bold text-lg tracking-tight mb-0.5 ${t.text}`}>{title}</h2>
                          <p className={`text-xs font-medium mb-3 ${t.textSec}`}>snaplinks.in/bio/{alias}</p>
                          
                          {bioText && (
                            <p className={`text-center text-[13px] leading-[1.5] mb-5 ${t.textMuted}`}>
                              {bioText}
                            </p>
                          )}

                          <div className="w-full flex flex-col gap-3">
                            {(!bioPage?.links || bioPage.links.length === 0) ? (
                              <div className={`p-4 text-center rounded-[16px] border text-xs ${t.linkBg} ${t.textMuted}`}>
                                No links added yet.
                              </div>
                            ) : (
                              bioPage.links.map((link: any, index: number) => {
                                const isFeatured = index === 0;
                                const borderRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-md' : 'rounded-[16px]';
                                const cardClass = isFeatured ? `${borderRad} p-3 w-full flex items-center justify-between ${t.featuredClass}` : `${borderRad} p-3 w-full flex items-center justify-between ${t.linkBg}`;
                                const iconRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-md' : 'rounded-[10px]';
                                const iconContainerClass = isFeatured ? `w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 ${iconRad} ${t.featuredIconBg}` : `w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 ${iconRad} ${themeType === 'dark-glass' ? '' : t.iconBg}`;
                                const titleClass = `text-[13px] mb-0.5 ${isFeatured ? (themeType === 'solid' ? 'text-black' : 'text-white') : t.linkText} ${themeType === 'neo-brutalism' ? 'font-black uppercase' : 'font-bold'}`;
                                
                                return (
                                  <div key={link.id} className={cardClass}>
                                    <div className="flex items-center">
                                      <div className={iconContainerClass} style={!isFeatured && themeType === 'dark-glass' ? { background: themeColor, color: 'white' } : {}}>
                                        <div className="w-4 h-4 rounded-full bg-current opacity-50"></div>
                                      </div>
                                      <div className="flex flex-col text-left justify-center">
                                        <span className={titleClass}>{link.title}</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            )}
                          </div>
                          
                          {/* Social Icons inside preview */}
                          {(twitterUrl || instagramUrl || githubUrl || linkedinUrl) && (
                            <div className="flex justify-center gap-4 pt-6 pb-4">
                              {twitterUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></div>}
                              {instagramUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>}
                              {githubUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></div>}
                              {linkedinUrl && <div className={`w-8 h-8 flex items-center justify-center border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></div>}
                            </div>
                          )}

'''

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_text = text[:start_idx] + live_preview_code + '\n' + end_marker + text[end_idx + len(end_marker):]
    with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Injected live preview securely!")
else:
    print(f"Could not find markers. start: {start_idx}, end: {end_idx}")
