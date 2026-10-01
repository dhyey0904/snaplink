import re
import os

files = ['frontend/src/app/login/page.tsx', 'frontend/src/app/register/page.tsx', 'frontend/src/app/forgot-password/page.tsx']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Add overflow-y-auto to the left side container so it can scroll internally if the screen is too tiny
        c = c.replace('className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-32 py-10 lg:py-0 relative z-10', 'className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-32 py-10 lg:py-0 relative z-10 overflow-y-auto"')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(c)

print("Added inner scroll fallback")
