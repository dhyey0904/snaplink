import re

with open("frontend/.env.local", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(
    r"NEXT_PUBLIC_GOOGLE_CLIENT_ID=.*",
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID=234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com",
    content
)

with open("frontend/.env.local", "w", encoding="utf-8") as f:
    f.write(content)

with open("frontend/src/app/layout.tsx", "r", encoding="utf-8") as f:
    layout = f.read()

layout = layout.replace(
    '"265865558141-2cp9num2eh4felku1j0fcchmtnej3bai.apps.googleusercontent.com"',
    '"234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com"'
)

with open("frontend/src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(layout)

# Update backend .env too
with open("backend/.env", "r", encoding="utf-8") as f:
    backend_env = f.read()

backend_env = re.sub(
    r"GOOGLE_CLIENT_ID=.*",
    "GOOGLE_CLIENT_ID=234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com",
    backend_env
)

with open("backend/.env", "w", encoding="utf-8") as f:
    f.write(backend_env)

print("Reverted Client IDs successfully")
