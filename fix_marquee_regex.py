import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">([\s\S]*?)</div>\s*</div>\s*</div>\s*</section>\s*\{\/\* API ACCESS SECTION \*\/\}'
match = re.search(pattern, c)

if match:
    cards = match.group(1)
    # Add width and flex-shrink to the cards so they form a row
    cards_mod = cards.replace('<div className="bg-[#fafafc]', '<div className="w-[280px] shrink-0 bg-[#fafafc]')
    
    # We want 3 copies for a smooth infinite scroll across large screens
    replacement = f"""<div className="relative w-full overflow-hidden pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] hover:[&>div]:[animation-play-state:paused]">
                <div className="flex w-max animate-marquee gap-8">
                  {cards_mod}
                  {cards_mod}
                  {cards_mod}
                </div>
              </div>
            </div>
          </section>

          {{/* API ACCESS SECTION */}}"""
          
    new_c = c[:match.start()] + replacement + c[match.end():]
    with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_c)
    print("Replaced grid with scrolling marquee")
else:
    print("Regex failed")
