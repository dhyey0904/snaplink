from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database.database import get_db
from app.models.link import Link
from app.models.click import Click

router = APIRouter()

@router.get("/{short_code}")
def redirect_to_original(short_code: str, request: Request, db: Session = Depends(get_db)):
    link = db.query(Link).filter(
        (Link.short_code == short_code) | (Link.custom_alias == short_code)
    ).first()

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    if not link.is_active:
        raise HTTPException(status_code=400, detail="This link has been disabled")
    
    if link.expires_at and link.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
         raise HTTPException(status_code=400, detail="This link has expired")
    
    if link.password_hash:
        pwd = request.query_params.get("pwd")
        from app.core.security import verify_password
        if not pwd or not verify_password(pwd, link.password_hash):
            return RedirectResponse(url=f"https://snaplinks.in/unlock/{short_code}")
            
    # Record the click
    user_agent = request.headers.get("user-agent", "Unknown")
    ip_address = request.client.host if request.client else "Unknown"
    referer = request.headers.get("referer", "Direct")

    browser = "Other"
    if "Chrome" in user_agent: browser = "Chrome"
    elif "Firefox" in user_agent: browser = "Firefox"
    elif "Safari" in user_agent and "Chrome" not in user_agent: browser = "Safari"
    
    device = "Desktop"
    if "Mobile" in user_agent or "Android" in user_agent or "iPhone" in user_agent:
        device = "Mobile"

    click = Click(
        link_id=link.id,
        ip=ip_address,
        browser=browser,
        device=device,
        referrer=referer,
        country="Unknown" 
    )
    db.add(click)
    db.commit()

    return RedirectResponse(url=link.original_url)
