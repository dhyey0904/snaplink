from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.user import User
from app.models.link import Link
from app.models.bio import BioPage
from app.models.click import Click
from app.models.report import Report
from app.api.auth import get_current_user

router = APIRouter()

def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.email != "rajadhyey1@gmail.com":
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

@router.get("/users")
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []
    for user in users:
        link_count = db.query(func.count(Link.id)).filter(Link.user_id == user.id).scalar() or 0
        result.append({
            "id": user.id,
            "email": user.email,
            "tier": user.tier,
            "created_at": user.created_at,
            "link_count": link_count
        })
    return result

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # In a real app we might want to soft delete or delete cascade manually
    # For now, we will simply delete the user (assuming cascade is setup or letting foreign keys block if not)
    # Actually, SQLAlchemy might throw IntegrityError if we don't cascade, but we'll attempt it.
    try:
        db.delete(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Cannot delete user. They have active resources.")
    return {"message": "User deleted successfully"}
