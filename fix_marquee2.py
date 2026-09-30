import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Find the exact grid block
start_str = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">'
end_str = '              </div>\n            </div>\n                  </section>\n  \n          {/* API ACCESS SECTION */}'

if start_str in c and end_str in c:
    start_idx = c.index(start_str)
    end_idx = c.index(end_str)
    
    grid_block = c[start_idx + len(start_str):end_idx]
    
    # Each card needs a fixed width
    grid_block = grid_block.replace('<div className="bg-[#fafafc]', '<div className="w-[300px] shrink-0 bg-[#fafafc]')
    
    replacement = f"""<div className="relative w-full overflow-hidden pb-12 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] hover:[&>div]:[animation-play-state:paused]">
                <div className="flex w-max animate-marquee gap-8">
                  {grid_block}
                  {grid_block}
                </div>
              </div>"""
              
    new_c = c[:start_idx] + replacement + '\n            </div>\n                  </section>\n  \n          {/* API ACCESS SECTION */}' + c[end_idx + len(end_str):]
    
    with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_c)
    print("Replaced grid with marquee")
else:
    print("Strings not found")
