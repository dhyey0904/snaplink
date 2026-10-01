import re

file = 'frontend/src/app/[shortCode]/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the Props type and the generateMetadata function signature
c = c.replace('type Props = {\n  params: { shortCode: string }\n};', 'type Props = {\n  params: Promise<{ shortCode: string }>\n};')

# Inside generateMetadata, await params
c = c.replace('const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";', 'const resolvedParams = await params;\n  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";')

# Replace params.shortCode with resolvedParams.shortCode
c = c.replace('${params.shortCode}', '${resolvedParams.shortCode}')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed layout params await")
