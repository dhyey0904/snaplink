import re

file = 'frontend/src/app/login/page.tsx'
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


# Replace hardcoded dashboard redirects
c = c.replace('setTimeout(() => router.replace("/dashboard"), 400);', 'setTimeout(() => redirectUser(result.access_token || data.access_token), 400);')


with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated login redirects")
