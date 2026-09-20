const fs = require('fs');
let text = fs.readFileSync('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'utf8');

const tabsRegex = /<div className="flex gap-2 mb-8 bg-white p-1\.5 rounded-2xl shadow-sm border border-gray-200 inline-flex self-start overflow-x-auto max-w-full hide-scrollbar">.*?<\/div>/s;

const tabsReplace = `<div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 self-start w-full sm:w-auto">
                    <button onClick={() => setActiveTab('links')} className={\`px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center \${activeTab === 'links' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>Links</button>
                    <button onClick={() => setActiveTab('profile')} className={\`px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center \${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>Profile</button>
                    <button onClick={() => setActiveTab('design')} className={\`px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center \${activeTab === 'design' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>Appearance</button>
                    <button onClick={() => setActiveTab('preview')} className={\`lg:hidden px-3 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center w-full mt-1 sm:mt-0 \${activeTab === 'preview' ? 'bg-[#1a73e8] text-white shadow-md' : 'text-blue-600 hover:bg-blue-50 bg-blue-50/50'}\`}>Live Preview</button>
                  </div>`;

text = text.replace(tabsRegex, tabsReplace);
fs.writeFileSync('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', text, 'utf8');
console.log("Tabs fixed with regex node script!");
