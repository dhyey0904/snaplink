import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the tabs container to use flex-wrap
tabs_find = '''                  {/* Tabs */}
                  <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 inline-flex self-start overflow-x-auto max-w-full hide-scrollbar">
                    <button onClick={() => setActiveTab('links')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'links' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Links</button>
                    <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Profile Settings</button>
                    <button onClick={() => setActiveTab('design')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'design' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Appearance</button>
                    <button onClick={() => setActiveTab('preview')} className={`lg:hidden px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'preview' ? 'bg-[#1a73e8] text-white shadow-md' : 'text-blue-600 hover:bg-blue-50'}`}>Live Preview</button>
                  </div>'''

tabs_replace = '''                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 self-start w-full sm:w-auto">
                    <button onClick={() => setActiveTab('links')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center ${activeTab === 'links' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Links</button>
                    <button onClick={() => setActiveTab('profile')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center ${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Profile</button>
                    <button onClick={() => setActiveTab('design')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center ${activeTab === 'design' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Appearance</button>
                    <button onClick={() => setActiveTab('preview')} className={`lg:hidden px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none text-center w-full mt-1 sm:mt-0 ${activeTab === 'preview' ? 'bg-[#1a73e8] text-white shadow-md' : 'text-blue-600 hover:bg-blue-50 bg-blue-50/50'}`}>Live Preview</button>
                  </div>'''

text = text.replace(tabs_find, tabs_replace)

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Tabs wrapped successfully!")
