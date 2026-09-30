import re

with open('backend/app/main.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's see what is on line 20-21
lines = c.split('\n')
for i, line in enumerate(lines):
    if 'try:' in line or 'Base.metadata' in line:
        pass # we will just overwrite it cleanly

clean = []
in_try_block = False
for line in lines:
    if line.strip() == 'try:':
        clean.append('try:')
        in_try_block = True
    elif in_try_block and 'Base.metadata.create_all(bind=engine)' in line:
        clean.append('    Base.metadata.create_all(bind=engine)')
    elif in_try_block and 'except Exception as e:' in line:
        clean.append('except Exception as e:')
    elif in_try_block and 'print("DB CREATE ALL FAILED:", e)' in line:
        clean.append('    print("DB CREATE ALL FAILED:", e)')
        in_try_block = False
    else:
        clean.append(line)

with open('backend/app/main.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(clean))
