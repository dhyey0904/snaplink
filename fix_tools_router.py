import os

file_path = 'backend/app/main.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add the import
if 'from app.api import tools' not in content:
    content = content.replace(
        'from app.api import image, sitemap, bridge',
        'from app.api import image, sitemap, bridge, tools'
    )

# Add the router
if 'app.include_router(tools.router' not in content:
    content = content.replace(
        'app.include_router(bridge.router, prefix="/api/bridge", tags=["bridge"])',
        'app.include_router(bridge.router, prefix="/api/bridge", tags=["bridge"])\napp.include_router(tools.router, prefix="/api/tools", tags=["tools"])'
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added tools router to main.py")
