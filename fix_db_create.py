import re
with open('backend/app/main.py', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('Base.metadata.create_all(bind=engine)', 'try:\n    Base.metadata.create_all(bind=engine)\nexcept Exception as e:\n    print("DB CREATE ALL FAILED:", e)')

with open('backend/app/main.py', 'w', encoding='utf-8') as f:
    f.write(c)
