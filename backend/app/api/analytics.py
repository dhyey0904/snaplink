from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Any, Dict

from app.database.database import get_db
from app.models.link import Link
from app.models.click import Click
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/{link_id}", response_model=Dict[str, Any])
def get_link_analytics(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Verify the link belongs to the user
    link = db.query(Link).filter(Link.id == link_id, Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    # Aggregate clicks
    total_clicks = db.query(Click).filter(Click.link_id == link_id).count()

    # Browser stats
    browsers = db.query(Click.browser, func.count(Click.id)).filter(Click.link_id == link_id).group_by(Click.browser).all()
    browser_stats = {b[0]: b[1] for b in browsers}

    # Device stats
    devices = db.query(Click.device, func.count(Click.id)).filter(Click.link_id == link_id).group_by(Click.device).all()
    device_stats = {d[0]: d[1] for d in devices}

    # Referrer stats
    referrers = db.query(Click.referrer, func.count(Click.id)).filter(Click.link_id == link_id).group_by(Click.referrer).all()
    referrer_stats = {r[0]: r[1] for r in referrers}

    # Daily clicks for the last 30 days
    # Using DATE() cast to group by day
    from sqlalchemy.sql import cast
    from sqlalchemy import Date
    
    daily_clicks_query = (
        db.query(cast(Click.clicked_at, Date).label('date'), func.count(Click.id).label('count'))
        .filter(Click.link_id == link_id)
        .group_by('date')
        .order_by('date')
        .all()
    )
    clicks_by_date = [{"date": str(d.date), "clicks": d.count} for d in daily_clicks_query]

    return {
        "link_id": link_id,
        "total_clicks": total_clicks,
        "browsers": browser_stats,
        "devices": device_stats,
        "referrers": referrer_stats,
        "daily_clicks": clicks_by_date
    }
