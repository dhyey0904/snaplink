import re

file = 'backend/app/api/admin.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

analytics_endpoint = """
@router.get('/analytics')
def get_admin_analytics(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    import datetime
    
    # Total clicks
    total_clicks = db.query(func.count(Click.id)).scalar() or 0
    
    # Last 7 days data
    today = datetime.datetime.utcnow().date()
    days_data = []
    
    for i in range(6, -1, -1):
        target_date = today - datetime.timedelta(days=i)
        next_date = target_date + datetime.timedelta(days=1)
        
        # Count clicks for this day
        count = db.query(func.count(Click.id)).filter(
            Click.clicked_at >= target_date,
            Click.clicked_at < next_date
        ).scalar() or 0
        
        days_data.append({
            "name": target_date.strftime("%a"), # e.g. "Mon"
            "count": count
        })
        
    # Top Referrers
    referrers = db.query(
        Click.referrer, 
        func.count(Click.id).label('count')
    ).group_by(Click.referrer).order_by(func.count(Click.id).desc()).limit(4).all()
    
    top_sources = []
    for r in referrers:
        source_name = r.referrer if r.referrer else "Direct / Unknown"
        pct = int((r.count / total_clicks) * 100) if total_clicks > 0 else 0
        top_sources.append({
            "source": source_name,
            "count": r.count,
            "pct": pct
        })
        
    return {
        "total_clicks": total_clicks,
        "daily_data": days_data,
        "top_sources": top_sources
    }
"""

c = c + '\n' + analytics_endpoint

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added analytics endpoint")
