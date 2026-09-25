import re

with open("backend/app/api/redirect.py", "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'''from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi\.responses import RedirectResponse'''

replacement = '''import httpx
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
'''

content = content.replace("from fastapi import APIRouter, Depends, HTTPException, Request\nfrom fastapi.responses import RedirectResponse", replacement)

# Replace the redirect_to_original signature
content = content.replace("def redirect_to_original(short_code: str, request: Request, db: Session = Depends(get_db)):", "def redirect_to_original(short_code: str, request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):")

# Replace the click recording logic
old_logic = '''    # Record the click (if not a bot/metadata fetch)
    if request.query_params.get("no_analytics") != "true":
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
        db.commit()'''

new_logic = '''    # Record the click in the background (Fast Redirect)
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
        )'''

content = content.replace(old_logic, new_logic)

with open("backend/app/api/redirect.py", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
