import re

with open('backend/app/main.py', 'r', encoding='utf-8') as f:
    c = f.read()

import_statement = "from app.api import auth, links, analytics, bio, vcard, files, payment, admin, integrations, rating, redirect, report\nfrom app.api import image"
c = re.sub(r'from app\.api import (.*)', import_statement, c)

include_statement = """    app.include_router(rating.router, prefix="/api/rating", tags=["rating"])
    app.include_router(image.router, prefix="/api/image", tags=["image"])"""
c = c.replace('    app.include_router(rating.router, prefix="/api/rating", tags=["rating"])', include_statement)

with open('backend/app/main.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Added image router to main.py")
