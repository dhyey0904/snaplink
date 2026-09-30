import re

with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Make the wrapper for "Everything you need, in one place" wider
search_str = """          {/* ALL-IN-ONE TOOLKIT */}
          <section className="py-24 bg-white text-[#202124] relative border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#202124]">Everything you need, in one place.</h2>"""

replace_str = """          {/* ALL-IN-ONE TOOLKIT */}
          <section className="py-24 bg-white text-[#202124] relative border-t border-gray-100">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#202124]">Everything you need, in one place.</h2>"""

c = c.replace(search_str, replace_str)

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Widened the container")
