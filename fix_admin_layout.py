import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

import_str = "import { usePathname, useRouter } from 'next/navigation';"
import_new = "import { usePathname, useRouter } from 'next/navigation';\nimport { useEffect, useState as useReactState } from 'react';"
c = c.replace(import_str, import_new)

old_state = "const [isSidebarOpen, setIsSidebarOpen] = useState(false);"
new_state = """const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.sub === 'hello.snaplinks@gmail.com') {
        setAuthorized(true);
      } else {
        router.replace('/dashboard');
      }
    } catch(e) {
      router.replace("/login");
    }
  }, [router]);

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }
"""

c = c.replace(old_state, new_state)
with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added admin layout guard")
