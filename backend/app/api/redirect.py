import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database.database import SessionLocal

def record_click_background(link_id: int, ip_address: str, user_agent: str, referer: str):
    db = SessionLocal()
    try:
        browser = "Other"
        if "Chrome" in user_agent: browser = "Chrome"
        elif "Firefox" in user_agent: browser = "Firefox"
        elif "Safari" in user_agent and "Chrome" not in user_agent: browser = "Safari"
        
        device = "Desktop"
        if "Mobile" in user_agent or "Android" in user_agent or "iPhone" in user_agent:
            device = "Mobile"

        country = "Unknown"
        city = "Unknown"
        
        # Fast async-like fetch using httpx (sync mode inside background thread)
        if ip_address and ip_address != "127.0.0.1" and ip_address != "Unknown":
            try:
                res = httpx.get(f"http://ip-api.com/json/{ip_address}?fields=country,city", timeout=2.0)
                if res.status_code == 200:
                    data = res.json()
                    country = data.get("country", "Unknown")
                    city = data.get("city", "Unknown")
            except Exception:
                pass

        click = Click(
            link_id=link_id,
            ip=ip_address,
            browser=browser,
            device=device,
            referrer=referer,
            country=country,
            city=city
        )
        db.add(click)
        db.commit()
    finally:
        db.close()

from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database.database import get_db
from app.models.link import Link
from app.models.click import Click

router = APIRouter()

@router.get("/{short_code}")
def redirect_to_original(short_code: str, request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
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
            if request.query_params.get("json") == "true":
                raise HTTPException(status_code=401, detail="Password required or incorrect")
            return RedirectResponse(url=f"https://snaplinks.in/unlock/{short_code}")
            
    # Record the click in the background (Fast Redirect)
    if request.query_params.get("no_analytics") != "true":
        user_agent = request.headers.get("user-agent", "Unknown")
        # Ensure we get the real IP if behind a proxy
        forwarded_for = request.headers.get("x-forwarded-for")
        ip_address = forwarded_for.split(",")[0] if forwarded_for else (request.client.host if request.client else "Unknown")
        referer = request.headers.get("referer", "Direct")
        
        background_tasks.add_task(
            record_click_background, 
            link_id=link.id, 
            ip_address=ip_address, 
            user_agent=user_agent, 
            referer=referer
        )

    if request.query_params.get("json") == "true":
        return {
            "original_url": link.original_url,
            "og_title": link.og_title,
            "og_description": link.og_description,
            "og_image": link.og_image
        }
        
    return RedirectResponse(url=link.original_url)
