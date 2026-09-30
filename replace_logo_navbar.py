import re

file = 'frontend/src/components/Navbar.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# We need to replace the entire <Link id="snaplinks-logo">...</Link> content with the new image
pattern = r'<Link href=\{isAdmin \? "/admin" : isDashboard \? "/dashboard" : "/"\} id="snaplinks-logo".*?</Link>'

replacement = """<Link href={isAdmin ? "/admin" : isDashboard ? "/dashboard" : "/"} id="snaplinks-logo" className="flex-shrink-0 flex items-center group">
              <Image src="/logo-full.png" alt="SnapLinks Logo" width={180} height={40} className="w-[140px] sm:w-[160px] md:w-[180px] h-auto object-contain group-hover:scale-105 transition-transform duration-300" priority />
            </Link>"""

c = re.sub(pattern, replacement, c, flags=re.DOTALL)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Replaced animated text with full logo image")
