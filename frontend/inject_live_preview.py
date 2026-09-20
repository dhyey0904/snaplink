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
# The screen is closed after:
#                                 </div>
#                               );
#                             })}
#                           </div>
#                         </div>
#                       </div>
#                     </div>
#                   </div>
#                 </div>
#               </div>
#             </div>
#           </div>
#         )}
#       </main>
# 
# We'll just split on '{/* Scrollable Content inside Screen */}' and then find the closing tag for the screen content.

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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
'''

start_idx = text.find(start_marker)
end_idx = text.find('</main>', start_idx)

if start_idx != -1 and end_idx != -1:
    new_text = text[:start_idx] + live_preview_code + text[end_idx:]
    with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Injected live preview successfully!")
else:
    print("Could not find markers.")
