import re

files = ['frontend/src/app/login/page.tsx', 'frontend/src/app/register/page.tsx', 'frontend/src/app/forgot-password/page.tsx']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()

    # Replace the fake testimonial with a founder's mission statement
    c = c.replace('"Switching to SnapLinks was the best decision for our team. The 50MB ephemeral file sharing and stunning 3D vCards have completely elevated our brand."', 'SnapLinks was built with a relentless focus on high-quality reliability, pixel-perfect UI, and user privacy. We are driven by the passion to build tools that empower modern professionals.')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed text problem (Founder quoting himself)")
