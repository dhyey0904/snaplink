import re

with open("backend/app/api/analytics.py", "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'''    # Referrer stats
    referrers = db.query\(Click\.referrer, func\.count\(Click\.id\)\)\.filter\(Click\.link_id == link_id\)\.group_by\(Click\.referrer\)\.all\(\)
    referrer_stats = \{r\[0\]: r\[1\] for r in referrers\}'''

replacement = '''    # Referrer stats
    referrers = db.query(Click.referrer, func.count(Click.id)).filter(Click.link_id == link_id).group_by(Click.referrer).all()
    referrer_stats = {r[0]: r[1] for r in referrers}

    # Location stats (Countries)
    countries = db.query(Click.country, func.count(Click.id)).filter(Click.link_id == link_id).group_by(Click.country).all()
    country_stats = {c[0]: c[1] for c in countries}

    # Location stats (Cities)
    cities = db.query(Click.city, func.count(Click.id)).filter(Click.link_id == link_id).group_by(Click.city).all()
    city_stats = {c[0]: c[1] for c in cities}'''

content = re.sub(pattern, replacement, content)

pattern2 = r'''    return \{
        "link_id": link_id,
        "total_clicks": total_clicks,
        "browsers": browser_stats,
        "devices": device_stats,
        "referrers": referrer_stats,
        "daily_clicks": clicks_by_date
    \}'''

replacement2 = '''    return {
        "link_id": link_id,
        "total_clicks": total_clicks,
        "browsers": browser_stats,
        "devices": device_stats,
        "referrers": referrer_stats,
        "countries": country_stats,
        "cities": city_stats,
        "daily_clicks": clicks_by_date
    }'''

content = re.sub(pattern2, replacement2, content)

with open("backend/app/api/analytics.py", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
