import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Find the ALL-IN-ONE TOOLKIT section grid
search_start = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">'
search_end = '              </div>\n  \n              {/* Interactive FAQ Section */}'

# Wait, the end of the grid is before FAQ section? No, FAQ section is in a different section.
# Let's find the closing div of the grid.
search_pattern = r'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">([\s\S]*?)</div>\n          </section>'

match = re.search(search_pattern, c)
if match:
    cards = match.group(1)
    
    # We want to replace the grid with a scrolling marquee
    replacement = f"""<div className="relative w-full overflow-hidden pb-12 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] hover:[&>div]:pause">
                <div className="flex w-max animate-marquee gap-8">
                  {cards}
                  {cards}
                </div>
              </div>
          </section>"""
          
    c = c[:match.start()] + replacement + c[match.end():]
    
    # Also I need to add utility classes for the pause
    # Wait, tailwind v4 has hover:pause? It's typically hover:[animation-play-state:paused].
    # Let's fix that.
    c = c.replace('hover:[&>div]:pause', 'hover:[&>div]:[animation-play-state:paused]')
    
    # Each card inside `cards` currently has `w-full` implicitly via grid. We need to set a fixed width for them so they scroll nicely.
    # Currently: <div className="bg-[#fafafc]...
    c = c.replace('<div className="bg-[#fafafc]', '<div className="w-[300px] shrink-0 bg-[#fafafc]')
    
    with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Replaced with marquee")
else:
    print("Could not find grid")
