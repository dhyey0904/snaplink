import re

file = 'frontend/src/app/register/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add JWT parse helper
jwt_helper = """
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const redirectUser = (token: string) => {
    const payload = parseJwt(token);
    if (payload && payload.sub === 'hello.snaplinks@gmail.com') {
      router.replace('/admin');
    } else {
      router.replace('/dashboard');
    }
  };
"""

c = c.replace('const [error, setError] = useState("");', 'const [error, setError] = useState("");\n' + jwt_helper)

c = c.replace('setTimeout(() => router.replace("/dashboard"), 400);', 'setTimeout(() => redirectUser(data.access_token), 400);')

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

print("Fixed register redirects")
