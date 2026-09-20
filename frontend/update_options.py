import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the theme selection grid
theme_find = '''                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Theme Style</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {['solid', 'gradient', 'glassmorphism'].map(type => (
                                <div 
                                  key={type}
                                  onClick={() => setThemeType(type)}
                                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${themeType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                  <div className={`w-full h-12 rounded-lg mb-2 ${type === 'solid' ? 'bg-blue-500' : type === 'gradient' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gray-100 backdrop-blur-md border border-white'}`}></div>
                                  <p className="text-center font-bold text-sm text-gray-900 capitalize">{type}</p>
                                </div>
                              ))}
                            </div>
                          </div>'''

theme_replace = '''                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Theme Style</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {[
                                { id: 'dark-glass', name: 'Dark Glass', bg: 'bg-[#0a0a0f] border-gray-700' },
                                { id: 'light-glass', name: 'Light Glass', bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' },
                                { id: 'solid', name: 'Solid Color', bg: 'bg-blue-500 border-transparent' },
                                { id: 'neo-brutalism', name: 'Neo Brutalism', bg: 'bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none' },
                                { id: 'minimal', name: 'Minimalist', bg: 'bg-white border-gray-200' }
                              ].map(theme => (
                                <div 
                                  key={theme.id}
                                  onClick={() => setThemeType(theme.id)}
                                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${themeType === theme.id ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                  <div className={`w-full h-12 rounded-lg mb-3 border ${theme.bg}`}></div>
                                  <p className="text-center font-bold text-sm text-gray-900">{theme.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>'''

text = text.replace(theme_find, theme_replace)

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Dashboard theme options updated!")
