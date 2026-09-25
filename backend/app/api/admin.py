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

@router.get('/links')
def get_all_links(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    links = db.query(Link).order_by(Link.created_at.desc()).all()
    result = []
    for link in links:
        owner = db.query(User).filter(User.id == link.user_id).first()
        clicks = db.query(func.count(Click.id)).filter(Click.link_id == link.id).scalar() or 0
        result.append({
            'id': link.id,
            'original_url': link.original_url,
            'short_code': link.custom_alias or link.short_code,
            'created_at': link.created_at,
            'clicks': clicks,
            'owner_email': owner.email if owner else 'Unknown',
            'is_active': link.is_active
        })
    return result

@router.delete('/links/{link_id}')
def delete_link(link_id: int, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    link = db.query(Link).filter(Link.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail='Link not found')
    db.query(Click).filter(Click.link_id == link.id).delete()
    db.delete(link)
    db.commit()
    return {'message': 'Link deleted successfully'}

@router.get('/files')
def get_all_files(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    files = db.query(FileShare).order_by(FileShare.created_at.desc()).all()
    result = []
    for file in files:
        owner = db.query(User).filter(User.id == file.user_id).first() if file.user_id else None
        result.append({
            'id': file.id,
            'filename': file.filename,
            'size_bytes': file.size_bytes,
            'downloads': file.downloads,
            'expires_at': file.expires_at,
            'created_at': file.created_at,
            'short_code': file.short_code,
            'owner_email': owner.email if owner else 'Guest'
        })
    return result

@router.delete('/files/{file_id}')
def delete_file(file_id: int, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    import os
    file = db.query(FileShare).filter(FileShare.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail='File not found')
    
    # Try to delete from disk
    try:
        if os.path.exists(file.file_path):
            os.remove(file.file_path)
    except Exception:
        pass
        
    db.delete(file)
    db.commit()
    return {'message': 'File deleted successfully'}

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
