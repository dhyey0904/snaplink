import re

with open('frontend/src/app/tools/image-compressor/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove imports
c = re.sub(r"import AdSidebar from '@/components/AdSidebar';\n", "", c)
c = re.sub(r"import AdBanner from '@/components/AdBanner';\n", "", c)

# Remove AdBanner usages
c = re.sub(r"<AdBanner />", "", c)

# Remove AdSidebar wrapper divs
c = re.sub(r'<div className="hidden xl:block w-\[300px\] shrink-0">\s*<AdSidebar />\s*</div>', '', c)
c = re.sub(r'<div className="mt-6">\s*<AdSidebar />\s*</div>', '', c)

with open('frontend/src/app/tools/image-compressor/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed ads")
