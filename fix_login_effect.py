import re

file = 'frontend/src/app/login/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix useEffect hardcoded redirect
old_effect = """  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);"""

new_effect = """  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      redirectUser(token);
    }
  }, [router]);"""

c = c.replace(old_effect, new_effect)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed useEffect redirect")
