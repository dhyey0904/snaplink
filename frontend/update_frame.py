import re
import sys

try:
    with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
        text = f.read()

    # Match the old frame start
    pattern_start = re.compile(r'<div className="w-\[320px\] h-\[680px\].*?{/\* Mobile Header \*/}', re.DOTALL)

    replacement_start = '''{/* Realistic iPhone Frame */}
                    <div className="relative w-[340px] h-[720px] rounded-[3.5rem] bg-black p-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-gray-900/10">
                      
                      {/* Hardware Buttons */}
                      <div className="absolute top-[120px] -left-[2px] w-[3px] h-[30px] bg-gray-800 rounded-l-md"></div>
                      <div className="absolute top-[170px] -left-[2px] w-[3px] h-[60px] bg-gray-800 rounded-l-md"></div>
                      <div className="absolute top-[240px] -left-[2px] w-[3px] h-[60px] bg-gray-800 rounded-l-md"></div>
                      <div className="absolute top-[190px] -right-[2px] w-[3px] h-[90px] bg-gray-800 rounded-r-md"></div>

                      {/* Screen */}
                      <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col">
                        
                        {/* Dynamic Island & Status Bar */}
                        <div className="absolute top-0 inset-x-0 h-14 z-30 pointer-events-none flex justify-between items-start px-6 pt-3 text-[13px] font-semibold text-white">
                          <span className="mt-1 ml-1 drop-shadow-md">9:41</span>
                          
                          {/* Dynamic Island */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[120px] h-[32px] bg-black rounded-full flex items-center justify-end px-3 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            <div className="w-3 h-3 rounded-full bg-[#111] shadow-inner mr-1.5 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]"></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 mr-1 drop-shadow-md">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21L23.6 7.4C22.6 6.6 18.2 3 12 3 5.8 3 1.4 6.6 0.4 7.4L12 21Z"/></svg>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z"/></svg>
                            <div className="w-6 h-3 rounded-[4px] border border-white flex items-center p-[1px]"><div className="bg-white h-full w-[80%] rounded-[2px]"></div></div>
                          </div>
                        </div>

                        {/* Bottom Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-black/30 backdrop-blur-md rounded-full z-30 pointer-events-none"></div>

                        {/* Scrollable Content inside Screen */}
                        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pt-0 relative z-10">
                          
                          {/* Mobile Header */}'''

    text = pattern_start.sub(replacement_start, text, count=1)

    pattern_end = re.compile(r'(.*?)(\s*)\}\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*\)\}\s*\n\s*</main>', re.DOTALL)
    replacement_end = r'\1\2}\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        )}\n      </main>'

    text = pattern_end.sub(replacement_end, text)

    with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully updated")
except Exception as e:
    print(f"Error: {e}")
