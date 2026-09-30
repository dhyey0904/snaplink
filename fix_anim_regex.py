import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

start_idx = c.find('{/* Feature 1 */}')
# Find the next 5 occurrences of <div className="w-[280px]...
# It's easier to just use regex to extract from Feature 1 to the end of Feature 5.

pattern = r'\{\/\* Feature 1 \*\/\}[\s\S]*?<h3 className="text-xl font-bold mb-3 text-gray-900">SnapBridge<\/h3>[\s\S]*?<\/div>'
match = re.search(pattern, c)

if match:
    single_set = match.group(0)
    
    wrapper_start = '<div className="relative w-full overflow-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0'
    w_start_idx = c.find(wrapper_start)
    
    # We will just replace everything from w_start_idx to </section> before API ACCESS SECTION
    api_section_idx = c.find('{/* API ACCESS SECTION */}')
    
    if w_start_idx != -1 and api_section_idx != -1:
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
          </section>

          """
        new_c = c[:w_start_idx] + replacement + c[api_section_idx:]
        with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
            f.write(new_c)
        print("Fixed animation HTML structure")
    else:
        print("Wrapper not found")
else:
    print("Features not found")
