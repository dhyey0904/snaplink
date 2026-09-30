import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the Room Code Box
room_code_old = """<div className="absolute top-6 right-6 bg-white border border-gray-200 shadow-lg rounded-xl p-3 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>"""
room_code_new = """<div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white border border-gray-200 shadow-lg rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 animate-bounce z-20 scale-90 sm:scale-100 origin-top-right" style={{ animationDuration: '3s' }}>"""
c = c.replace(room_code_old, room_code_new)

# Fix the project_v2.zip Box
project_old = """<div className="absolute bottom-6 left-6 bg-white border border-orange-200 shadow-lg rounded-xl p-3 flex items-center gap-3">"""
project_new = """<div className="absolute bottom-4 sm:bottom-6 left-1/2 sm:left-6 -translate-x-1/2 sm:translate-x-0 w-[85%] sm:w-auto bg-white border border-orange-200 shadow-lg rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 z-20">"""
c = c.replace(project_old, project_new)

# Make the dashed box padding smaller on mobile so text fits
dashed_old = """<div className="w-full max-w-sm bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center">"""
dashed_new = """<div className="w-full max-w-sm bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center h-full sm:h-auto pb-16 sm:pb-8">"""
c = c.replace(dashed_old, dashed_new)

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed mockup responsiveness")
