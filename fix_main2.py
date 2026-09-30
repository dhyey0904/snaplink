import re
with open('backend/app/main.py', 'r', encoding='utf-8') as f:
    c = f.read()

if 'from app.models.bridge import Transfer' not in c:
    c = c.replace('from app.models import User, Link, Click', 'from app.models import User, Link, Click\n    from app.models.bridge import Transfer')

if 'from app.api import image, sitemap' in c:
    c = c.replace('from app.api import image, sitemap', 'from app.api import image, sitemap, bridge')
    c = c.replace('app.include_router(sitemap.router, prefix="/api", tags=["sitemap"])', 'app.include_router(sitemap.router, prefix="/api", tags=["sitemap"])\n    app.include_router(bridge.router, prefix="/api/bridge", tags=["bridge"])')

with open('backend/app/main.py', 'w', encoding='utf-8') as f:
    f.write(c)
