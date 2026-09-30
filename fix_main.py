import re

with open('backend/app/main.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Add import
if 'from app.api import sitemap' not in c:
    c = c.replace('from app.api import image', 'from app.api import image, sitemap')

# Add router inclusion
if 'app.include_router(sitemap.router' not in c:
    c = c.replace('app.include_router(image.router, prefix="/api/image", tags=["image"])', 
                  'app.include_router(image.router, prefix="/api/image", tags=["image"])\n    app.include_router(sitemap.router, prefix="/api", tags=["sitemap"])')

with open('backend/app/main.py', 'w', encoding='utf-8') as f:
    f.write(c)
print("Included sitemap in main.py")
