import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

old_logo = '<span className="text-[#2563EB]">SnapLinks</span>OS'

new_logo = """<span className="text-xl font-bold tracking-tight text-[#202124] group-hover:scale-105 transition-transform duration-300 flex">
                <span className="flex">
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '0ms' }}>S</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '100ms' }}>n</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '200ms' }}>a</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '300ms' }}>p</span>
                </span>
                <span className="text-[#ea4335] flex">
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '400ms' }}>A</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '500ms' }}>d</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '600ms' }}>m</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '700ms' }}>i</span>
                  <span className="inline-block animate-word-wave" style={{ animationDelay: '800ms' }}>n</span>
                </span>
              </span>"""

c = c.replace(old_logo, new_logo)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Changed logo to navbar logo")
