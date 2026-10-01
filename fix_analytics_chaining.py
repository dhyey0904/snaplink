import re

file = 'frontend/src/app/admin/analytics/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('data.overview.total_clicks.toLocaleString()', '(data?.overview?.total_clicks || data?.total_clicks || 0).toLocaleString()')
c = c.replace('data.overview.total_users.toLocaleString()', '(data?.overview?.total_users || 0).toLocaleString()')
c = c.replace('data.overview.total_links.toLocaleString()', '(data?.overview?.total_links || 0).toLocaleString()')

c = c.replace('items={data.top_sources}', 'items={data.top_sources || []}')
c = c.replace('items={data.top_countries}', 'items={data.top_countries || []}')
c = c.replace('items={data.top_devices}', 'items={data.top_devices || []}')
c = c.replace('items={data.top_browsers}', 'items={data.top_browsers || []}')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed optional chaining")
