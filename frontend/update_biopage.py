import re

with open('e:/snaplink/frontend/src/app/bio/[alias]/BioPageClient.tsx', 'r', encoding='utf-8') as f:
    original = f.read()

# We will just replace the default export function BioPageClient...
# But I must make sure I have all the code correctly.
# I'll create the new BioPageClient block.

new_client_code = '''
export default function BioPageClient({ bioPage }: { bioPage: any }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : "http://127.0.0.1:8000");

  const handleLinkClick = async (e: React.MouseEvent, link: any) => {
    try {
      await fetch(`${backendUrl}/api/analytics/track/${link.id}`, { method: 'POST' });
    } catch (err) {}
  };

  if (!bioPage) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-bold">Profile not found</div>;
  }

  const themeColor = bioPage.theme_color || '#8b5cf6';
  const themeType = bioPage.theme_type || 'dark-glass';

  const themes: Record<string, any> = {
    'dark-glass': {
      bg: 'bg-[#0a0a0f]',
      text: 'text-white',
      textSec: 'text-[#b0a8c2]',
      textMuted: 'text-white/40',
      linkBg: 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] backdrop-blur-lg shadow-lg',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/40 font-medium',
      iconBg: 'bg-white/5 border border-white/10 text-white',
      featuredClass: 'bg-gradient-to-r from-[#ff4b72] to-[#8b2cff] shadow-[0_4px_20px_rgba(139,44,255,0.3)] text-white',
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#0a0a0f]',
      showMesh: true,
      socialBg: 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-white',
    },
    'light-glass': {
      bg: 'bg-[#f8f9fa]',
      text: 'text-gray-900',
      textSec: 'text-gray-600',
      textMuted: 'text-gray-400',
      linkBg: 'bg-white/60 border border-white hover:bg-white/90 backdrop-blur-xl shadow-md',
      linkText: 'text-gray-900 font-bold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-white border border-gray-100 text-gray-900 shadow-sm',
      featuredClass: `bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg text-white`,
      featuredIconBg: 'bg-white/20 text-white',
      profileBg: 'bg-[#f8f9fa]',
      showMesh: true,
      socialBg: 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm',
    },
    'solid': {
      bg: '', // Overridden by style={{ backgroundColor: themeColor }}
      text: 'text-white',
      textSec: 'text-white/90',
      textMuted: 'text-white/60',
      linkBg: 'bg-black/10 hover:bg-black/20 border border-transparent shadow-sm',
      linkText: 'text-white font-bold',
      linkSub: 'text-white/70 font-medium',
      iconBg: 'bg-black/20 text-white',
      featuredClass: 'bg-white text-black shadow-lg',
      featuredIconBg: 'bg-black/10 text-black',
      profileBg: 'transparent',
      showMesh: false,
      socialBg: 'bg-black/10 hover:bg-black/20 text-white border-transparent',
    },
    'neo-brutalism': {
      bg: 'bg-[#FDF9F1]',
      text: 'text-black',
      textSec: 'text-black',
      textMuted: 'text-gray-700',
      linkBg: 'bg-white border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] shadow-[2px_2px_0_0_#000] rounded-none',
      linkText: 'text-black font-black uppercase tracking-tight',
      linkSub: 'text-gray-800 font-bold',
      iconBg: 'bg-[#FFEB3B] border-2 border-black text-black rounded-none',
      featuredClass: 'bg-[#FF90E8] border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] shadow-[2px_2px_0_0_#000] rounded-none text-black',
      featuredIconBg: 'bg-white border-2 border-black text-black rounded-none',
      profileBg: 'bg-[#FDF9F1]',
      showMesh: false,
      socialBg: 'bg-white border-2 border-black hover:bg-[#FFEB3B] text-black hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#000]',
    },
    'minimal': {
      bg: 'bg-white',
      text: 'text-gray-900',
      textSec: 'text-gray-500',
      textMuted: 'text-gray-400',
      linkBg: 'bg-transparent border border-gray-200 hover:border-gray-400 rounded-lg',
      linkText: 'text-gray-900 font-semibold',
      linkSub: 'text-gray-500 font-medium',
      iconBg: 'bg-gray-50 text-gray-700 border-none rounded-lg',
      featuredClass: 'bg-gray-900 text-white rounded-lg',
      featuredIconBg: 'bg-white/20 text-white rounded-lg',
      profileBg: 'bg-white',
      showMesh: false,
      socialBg: 'bg-transparent border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full',
    }
  };

  const t = themes[themeType] || themes['dark-glass'];

  return (
    <>
      <Head>
        <title>{bioPage.name} - SnapLink</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      
      <div 
        className={`min-h-screen relative w-full flex flex-col items-center py-16 px-4 overflow-x-hidden font-sans ${t.bg}`}
        style={themeType === 'solid' ? { backgroundColor: themeColor } : {}}
      >
        
        {/* Background Premium Mesh Gradient */}
        {t.showMesh && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {themeType === 'dark-glass' ? (
              <>
                <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-40 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full blur-[120px] opacity-30 mix-blend-screen" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full blur-[90px] opacity-20 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(29,161,242,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
              </>
            ) : (
              <>
                <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-[0.15] mix-blend-multiply" style={{ background: 'radial-gradient(circle, rgba(139,44,255,1) 0%, rgba(0,0,0,0) 70%)' }}></div>
                <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full blur-[120px] opacity-[0.15] mix-blend-multiply" style={{ background: `radial-gradient(circle, ${themeColor} 0%, rgba(0,0,0,0) 70%)` }}></div>
              </>
            )}
          </div>
        )}

        <div className="w-full max-w-[480px] z-10 flex flex-col items-center">
          
          {/* Settings / Menu Icon (Top Right) */}
          <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition ${t.iconBg}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
          </div>

          {/* Profile Picture */}
          <div className="relative mb-5 mt-4">
            {themeType === 'dark-glass' && (
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-[#ff6b6b] via-[#c0392b] to-[#8e44ad] p-[3px] shadow-[0_0_20px_rgba(142,68,173,0.4)]">
                 <div className="w-full h-full bg-[#0a0a0f] rounded-full"></div>
              </div>
            )}
            
            <div className="relative">
              {bioPage.profile_image_url ? (
                <img src={bioPage.profile_image_url} alt="Profile" className={`w-[104px] h-[104px] rounded-full object-cover border-2 ${themeType === 'neo-brutalism' ? 'border-4 border-black rounded-none shadow-[4px_4px_0_0_#000]' : 'border-transparent'}`} style={themeType !== 'neo-brutalism' ? { borderColor: t.profileBg } : {}} />
              ) : (
                <div className={`w-[104px] h-[104px] flex items-center justify-center text-4xl font-black ${themeType === 'neo-brutalism' ? 'border-4 border-black bg-[#FF90E8] text-black shadow-[4px_4px_0_0_#000]' : 'rounded-full bg-gray-200 text-gray-500'}`} style={themeType !== 'neo-brutalism' && !t.bg.includes('white') ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } : {}}>
                  {bioPage.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Name & Verified Badge */}
          <h1 className={`text-[22px] font-bold tracking-tight flex items-center justify-center mb-1 drop-shadow-sm ${t.text}`}>
            {bioPage.name}
            {Icons.verified}
          </h1>
          
          {/* Job Title / Description */}
          <p className={`text-[15px] font-medium mb-4 ${t.textSec}`}>
            {bioPage.title || 'Creator'}
          </p>

          {/* Long Bio */}
          {bioPage.description && (
            <p className={`text-center text-[14px] leading-[1.6] mb-8 px-6 max-w-[380px] ${t.textMuted}`}>
              {bioPage.description}
            </p>
          )}

          {/* Social Icons Row */}
          {(bioPage.twitter_url || bioPage.instagram_url || bioPage.github_url || bioPage.linkedin_url) && (
            <div className="flex justify-center gap-4 mb-10 w-full px-4">
              {bioPage.twitter_url && (
                <a href={bioPage.twitter_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.twitter}
                </a>
              )}
              {bioPage.github_url && (
                <a href={bioPage.github_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.github}
                </a>
              )}
              {bioPage.linkedin_url && (
                <a href={bioPage.linkedin_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.linkedin}
                </a>
              )}
              {bioPage.instagram_url && (
                <a href={bioPage.instagram_url} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  {Icons.instagram}
                </a>
              )}
              {bioPage.contact_email && (
                <a href={`mailto:${bioPage.contact_email}`} target="_blank" className={`w-[46px] h-[46px] flex items-center justify-center backdrop-blur-xl transition-all border ${themeType === 'neo-brutalism' ? 'rounded-none' : 'rounded-full'} ${t.socialBg}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Links Stack */}
          <div className="w-full flex flex-col gap-[14px]">
            {bioPage.links && bioPage.links.length > 0 ? (
              bioPage.links.map((link: any, index: number) => {
                
                const isFeatured = index === 0;
                
                // Construct the link classes based on the active theme
                const cardBase = "group relative w-full p-4 transition-all duration-300 transform flex items-center justify-between";
                const borderRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-lg' : 'rounded-[20px]';
                
                const cardClass = isFeatured 
                  ? `${cardBase} ${borderRad} ${t.featuredClass}`
                  : `${cardBase} ${borderRad} ${t.linkBg}`;

                const iconBase = "w-10 h-10 flex items-center justify-center mr-[14px] flex-shrink-0";
                const iconRad = themeType === 'neo-brutalism' ? 'rounded-none' : themeType === 'minimal' ? 'rounded-lg' : 'rounded-[12px]';
                
                const iconContainerClass = isFeatured
                  ? `${iconBase} ${iconRad} ${t.featuredIconBg}`
                  : `${iconBase} ${iconRad} ${themeType === 'dark-glass' ? '' : t.iconBg}`;

                const titleClass = `text-[15.5px] tracking-tight mb-0.5 ${isFeatured ? (themeType === 'solid' ? 'text-black' : 'text-white') : t.linkText} ${themeType === 'neo-brutalism' ? 'font-black uppercase' : 'font-bold'}`;
                const subtitleClass = `text-[12px] ${isFeatured ? (themeType === 'solid' ? 'text-black/70' : 'text-white/80') : t.linkSub} ${themeType === 'neo-brutalism' ? 'font-bold text-black/70' : 'font-medium'}`;

                const subtitle = getDomainSubtitle(link.url);
                const icon = getIconForUrl(link.url);

                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank"
                    onClick={(e) => handleLinkClick(e, link)}
                    className={cardClass}
                  >
                    <div className="flex items-center">
                      <div className={iconContainerClass} style={!isFeatured && themeType === 'dark-glass' ? { background: themeColor, color: 'white' } : {}}>
                         {icon}
                      </div>
                      <div className="flex flex-col text-left justify-center">
                        <span className={titleClass}>{link.title}</span>
                        <span className={subtitleClass}>{subtitle}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4 pl-2">
                      <svg className={`w-[18px] h-[18px] ${isFeatured ? (themeType === 'solid' ? 'text-black' : 'text-white') : t.textMuted}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className={`p-8 text-center rounded-[24px] border ${t.linkBg} ${t.textMuted}`}>
                No links added yet.
              </div>
            )}
          </div>

          {/* Footer Footer Footer */}
          <div className={`mt-14 mb-8 text-center flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity ${t.textMuted}`}>
             <div className="text-[13px] font-medium">
                Made with <span className="text-red-500 mx-0.5">❤️</span> by {(bioPage.name || bioPage.alias || 'Creator').split(' ')[0]}
             </div>
             <div className="text-[11px] opacity-70">
                © {new Date().getFullYear()} All rights reserved
             </div>
          </div>

        </div>
      </div>
    </>
  );
}
'''

# Use regex to replace the entire export default function BioPageClient
new_full_text = re.sub(r'export default function BioPageClient.*', new_client_code, original, flags=re.DOTALL)

with open('e:/snaplink/frontend/src/app/bio/[alias]/BioPageClient.tsx', 'w', encoding='utf-8') as f:
    f.write(new_full_text)

print("BioPageClient.tsx updated with gorgeous themes!")
