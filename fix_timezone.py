import re

with open('frontend/src/app/play/SnapPlayApp.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

bad_date = "const dateStr = new Date().toISOString().split('T')[0];"
good_date = """const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;"""

bad_today = "const todayStr = new Date().toISOString().split('T')[0];"
good_today = """const _d = new Date();
    const todayStr = `${_d.getFullYear()}-${_d.getMonth() + 1}-${_d.getDate()}`;"""

c = c.replace(bad_date, good_date)
c = c.replace(bad_today, good_today)

with open('frontend/src/app/play/SnapPlayApp.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed timezone bug")
