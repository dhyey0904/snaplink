import re

with open('frontend/src/app/layout.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

import_statement = "import { siteConfig } from '@/config/site';\n"
if 'siteConfig' not in c:
    c = c.replace('import "./globals.css";', 'import "./globals.css";\n' + import_statement)

replacement = """export const viewport = {
  themeColor: siteConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | The Ultimate All-in-One Digital Workspace`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,"""

c = re.sub(r'export const viewport = \{.*?description: "[^"]*",', replacement, c, flags=re.DOTALL)

with open('frontend/src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated layout metadata")
