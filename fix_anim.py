import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Grab the block from Feature 1 to the end of Feature 5
start_idx = c.find('{/* Feature 1 */}')
end_feat5 = '<p className="text-gray-600 text-base sm:text-sm leading-relaxed">Lightning-fast peer-to-peer file transfer rooms that self-destruct.</p>\n                  </div>'
end_idx = c.find(end_feat5) + len(end_feat5)

if start_idx != -1 and c.find(end_feat5) != -1:
    single_set = c[start_idx:end_idx]
    
    # Now find the wrapper
    wrapper_start = '<div className="relative w-full overflow-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0'
    w_start_idx = c.find(wrapper_start)
    
    wrapper_end = '              </div>\n            </div>\n          </section>'
    w_end_idx = c.find(wrapper_end, w_start_idx) + len(wrapper_end)
    
    if w_start_idx != -1 and w_end_idx != -1:
        replacement = f"""<div className="relative w-full overflow-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex gap-8 group">
                  <div className="flex shrink-0 animate-marquee gap-8 group-hover:[animation-play-state:paused]">
                    {single_set}
                  </div>
                  <div className="flex shrink-0 animate-marquee gap-8 group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {single_set}
                  </div>
                  <div className="flex shrink-0 animate-marquee gap-8 group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {single_set}
                  </div>
                </div>
              </div>
            </div>
          </section>"""
          
        new_c = c[:w_start_idx] + replacement + c[w_end_idx:]
        
        with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
            f.write(new_c)
        print("Fixed animation HTML structure")
    else:
        print("Wrapper not found")
else:
    print("Features not found")
