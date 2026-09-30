import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# I need to extract the cards first. I'll grab one set of cards.
# Notice I duplicated the cards 3 times, so I have to find the first occurrence of Feature 1 to SnapBridge.
start_feat1 = '{/* Feature 1 */}'
end_feat5 = '<p className="text-gray-600 text-base sm:text-sm leading-relaxed">Lightning-fast peer-to-peer file transfer rooms that self-destruct.</p>\n                  </div>'

if start_feat1 in c and end_feat5 in c:
    idx_start = c.find(start_feat1)
    idx_end = c.find(end_feat5) + len(end_feat5)
    
    single_set = c[idx_start:idx_end]
    
    # We will replace the entire relative wrapper
    wrapper_start = '<div className="relative w-full overflow-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] hover:[&>div]:[animation-play-state:paused]">'
    wrapper_end = '              </div>\n            </div>\n          </section>'
    
    if wrapper_start in c:
        w_start = c.find(wrapper_start)
        w_end = c.find(wrapper_end, w_start) + len(wrapper_end)
        
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
          
        c = c[:w_start] + replacement + c[w_end:]
        
        with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
            f.write(c)
        print("Fixed marquee structure")
    else:
        print("Wrapper not found")
else:
    print("Features not found")
