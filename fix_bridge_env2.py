import re
file = 'frontend/src/app/bridge/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace localhost fallback with production Render URL
c = c.replace(
    "`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api`",
    "`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com'}/api`"
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
