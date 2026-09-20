import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

helper = '''  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3) hexcolor = hexcolor.split('').map(c => c + c).join('');
    var r = parseInt(hexcolor.substr(0,2),16) || 0;
    var g = parseInt(hexcolor.substr(2,2),16) || 0;
    var b = parseInt(hexcolor.substr(4,2),16) || 0;
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  };
'''

if 'getContrastYIQ' not in text:
    text = text.replace('const handleDownloadQR =', helper + '\n  const handleDownloadQR =')

header_find = '''                        <div 
                          style={{
                            background: themeType === 'gradient' ? `linear-gradient(135deg, ${themeColor}aa, ${themeColor})` : themeColor
                          }} 
                          className="pt-16 pb-8 px-6 text-center text-white relative flex-shrink-0"
                        >'''

header_replace = '''                        <div 
                          style={{
                            background: themeType === 'gradient' ? `linear-gradient(135deg, ${themeColor}aa, ${themeColor})` : themeColor,
                            color: getContrastYIQ(themeColor)
                          }} 
                          className="pt-16 pb-8 px-6 text-center relative flex-shrink-0"
                        >'''

text = text.replace(header_find, header_replace)

p_find = '''                          <p className="text-sm opacity-90 mt-1 font-medium">snaplinks.in/bio/{bioPage.alias}</p>
                          {bioText && <p className="text-white/90 text-sm mt-3 leading-relaxed">{bioText}</p>}'''

p_replace = '''                          <p className="text-sm opacity-90 mt-1 font-medium">snaplinks.in/bio/{bioPage.alias}</p>
                          {bioText && <p className="text-sm mt-3 leading-relaxed opacity-90">{bioText}</p>}'''

text = text.replace(p_find, p_replace)

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed contrast')
