from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.user import User
from app.models.link import Link
from app.models.bio import BioPage
from app.models.click import Click
from app.api.auth import get_current_user

router = APIRouter()

def verify_admin(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_links = db.query(func.count(Link.id)).scalar() or 0
    total_bios = db.query(func.count(BioPage.id)).scalar() or 0
    total_clicks = db.query(func.count(Click.id)).scalar() or 0
    pro_users = db.query(func.count(User.id)).filter(User.tier == 'pro').scalar() or 0

    return {
        "total_users": total_users,
        "total_links": total_links,
        "total_bios": total_bios,
        "total_clicks": total_clicks,
        "pro_users": pro_users,
        "revenue_inr": pro_users * 199
    }
