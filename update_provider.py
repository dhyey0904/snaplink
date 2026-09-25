import re

with open("frontend/src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_provider = '<GoogleOAuthProvider clientId="234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com">'
new_provider = '<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "265865558141-2cp9num2eh4felku1j0fcchmtnej3bai.apps.googleusercontent.com"}>'

content = content.replace(old_provider, new_provider)

with open("frontend/src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated GoogleOAuthProvider")
