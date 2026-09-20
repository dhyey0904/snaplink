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
    with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Fixed!")
else:
    print("Already fixed!")
