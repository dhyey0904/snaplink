import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Video Input: Remove the URL input entirely
video_find = '''                                  <div className="space-y-2">
                                    <input 
                                      type="file" 
                                      accept="video/*"
                                      onChange={(e) => handleImageUpload(e, setNewLinkUrl)} 
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl" 
                                    />
                                    <input type="url" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className="block w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Or enter YouTube/Vimeo URL..." />
                                  </div>'''

video_replace = '''                                  <div className="space-y-2">
                                    <input 
                                      type="file" 
                                      accept="video/*"
                                      onChange={(e) => handleImageUpload(e, setNewLinkUrl)} 
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl" 
                                      required
                                    />
                                  </div>'''

text = text.replace(video_find, video_replace)


# 2. Resume Input: Change to File Input
resume_find = '''                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resume URL</label>
                                <input type="url" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900" placeholder="https://..." />
                              </div>'''

resume_replace = '''                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resume Upload</label>
                                <input 
                                  type="file" 
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => handleImageUpload(e, setResumeUrl)} 
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-all" 
                                />
                                {resumeUrl && <p className="text-xs text-green-600 mt-2 font-medium break-all">Uploaded: {resumeUrl}</p>}
                              </div>'''

text = text.replace(resume_find, resume_replace)

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Video and Resume uploads forced to file only!")
