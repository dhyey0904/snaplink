import re

with open('frontend/src/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

snapbridge_app = """    {
      name: "SnapBridge",
      description: "Secure, end-to-end temporary file transfer rooms with instant auto-destruct.",
      href: "/bridge",
      color: "bg-teal-500",
      lightBg: "bg-teal-50",
      textColor: "text-teal-600",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
      )
    },
"""

dev_api = """    {
      name: "Developer API","""

c = c.replace(dev_api, snapbridge_app + dev_api)

with open('frontend/src/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Injected SnapBridge")
