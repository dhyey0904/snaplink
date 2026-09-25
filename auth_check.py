import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add useRouter and useEffect for auth check
imports = '''import { useRouter } from "next/navigation";\n'''
if 'import { useRouter }' not in content:
    content = content.replace('import React, { useEffect, useState } from "react";', 'import React, { useEffect, useState } from "react";\n' + imports)

# Find the start of the component
comp_start = '''export default function SnapOS() {'''
auth_check = '''export default function SnapOS() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
'''

if 'const token = localStorage.getItem("token");' not in content:
    content = content.replace(comp_start, auth_check)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added Auth Check")
