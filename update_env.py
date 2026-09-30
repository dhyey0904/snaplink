import re

with open('backend/.env', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('postgresql://neondb_owner:npg_hZmpa2LlwC5G@', 'postgresql://neondb_owner:npg_sVe3qkHpUC7m@')

with open('backend/.env', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated backend .env with new Neon credentials")
