import re

files = ['frontend/src/app/login/page.tsx', 'frontend/src/app/register/page.tsx', 'frontend/src/app/forgot-password/page.tsx']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()

    # Match the navbar logo sizing
    c = c.replace('className="flex text-3xl font-extrabold tracking-tight text-white hover:scale-105 transition-transform origin-left drop-shadow-md group"', 'className="flex text-2xl font-bold tracking-tight text-white hover:scale-105 transition-transform origin-left drop-shadow-md group"')
    
    # Match the Links part color to the navbar's exact blue if they want it the same, but wait, navbar is #1557b0. On dark bg, #1a73e8 or blue-300 is better. Let's use #1a73e8 but lightened, or just keep text-blue-300.
    c = c.replace('text-blue-300 flex', 'text-[#4285f4] flex') # closer to google blue / navbar blue but visible on dark
    
    # Fix the card overlap and remove 3D rotation which might cause text rendering issues
    c = c.replace('mt-[-40px]', 'mt-12')
    c = c.replace('transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700', 'transform transition-all duration-500 hover:-translate-y-2')
    
    # Fix text issue (make it left aligned properly and clean)
    c = c.replace('text-blue-100 text-sm leading-relaxed mb-8 font-medium', 'text-blue-100/90 text-sm leading-relaxed mb-8 font-medium')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed auth right side UI")
