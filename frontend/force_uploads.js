const fs = require('fs');
let text = fs.readFileSync('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'utf8');

// 1. Video Input
const videoRegex = /<input[^>]*type="url"[^>]*value=\{newLinkUrl\}[^>]*onChange=\{\(e\) => setNewLinkUrl\(e\.target\.value\)\}[^>]*placeholder="Or enter YouTube\/Vimeo URL\.\.\."[^>]*\/>/g;
text = text.replace(videoRegex, '');

// 2. Resume Input
const resumeRegex = /<label[^>]*>Resume URL<\/label>\s*<input[^>]*type="url"[^>]*value=\{resumeUrl\}[^>]*onChange=\{e => setResumeUrl\(e\.target\.value\)\}[^>]*\/>/g;
const resumeReplace = `<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resume Upload</label>
                                <input 
                                  type="file" 
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => handleImageUpload(e, setResumeUrl)} 
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-all" 
                                />
                                {resumeUrl && <p className="text-xs text-green-600 mt-2 font-medium break-all max-w-[200px] truncate">Uploaded: {resumeUrl}</p>}`;

text = text.replace(resumeRegex, resumeReplace);

fs.writeFileSync('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', text, 'utf8');
console.log("Forced uploads applied via Node regex!");
