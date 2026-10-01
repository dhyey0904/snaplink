from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.user import User
from app.models.link import Link
from app.models.bio import BioPage
from app.models.click import Click
from app.models.report import Report
from app.models.file import FileShare
from app.models.rating import Rating
from app.api.auth import get_current_user

router = APIRouter()

def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.email != "hello.snaplinks@gmail.com":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_links = db.query(func.count(Link.id)).scalar() or 0
    total_bios = db.query(func.count(BioPage.id)).scalar() or 0
    total_clicks = db.query(func.count(Click.id)).scalar() or 0
    pro_users = db.query(func.count(User.id)).filter(User.tier == 'pro').scalar() or 0
    
    # Reports
    total_reports = db.query(func.count(Report.id)).scalar() or 0
    recent_reports = db.query(Report).order_by(Report.created_at.desc()).limit(10).all()

    return {
        "total_users": total_users,
        "total_links": total_links,
        "total_bios": total_bios,
        "total_clicks": total_clicks,
        "pro_users": pro_users,
        "revenue_inr": pro_users * 199,
        "total_reports": total_reports,
        "recent_reports": recent_reports
    }

@router.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}

from app.models.settings import SystemSettings
from pydantic import BaseModel

class SettingsUpdate(BaseModel):
    maintenance_mode: bool
    allow_registrations: bool
    max_upload_size_mb: int

@router.get("/settings")
def get_settings(db: Session = Depends(get_db), _: User = Depends(verify_admin)):
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.post("/settings")
def update_settings(update: SettingsUpdate, db: Session = Depends(get_db), _: User = Depends(verify_admin)):
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings()
        db.add(settings)
    
    settings.maintenance_mode = update.maintenance_mode
    settings.allow_registrations = update.allow_registrations
    settings.max_upload_size_mb = update.max_upload_size_mb
    
    db.commit()
    db.refresh(settings)
    return settings


@router.get('/ratings')
def get_all_ratings(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    ratings = db.query(Rating).order_by(Rating.created_at.desc()).all()
    result = []
    for r in ratings:
        result.append({
            'id': r.id,
            'stars': r.stars,
            'feedback': r.feedback,
            'created_at': r.created_at
        })
    return result

@router.delete('/ratings/{rating_id}')
def delete_rating(rating_id: int, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    r = db.query(Rating).filter(Rating.id == rating_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rating not found")
    db.delete(r)
    db.commit()
    return {"message": "Rating deleted successfully"}



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
