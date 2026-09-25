from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.link import Link, Click
from app.models.files import File
from app.api.auth import get_current_user
from sqlalchemy import func
import requests
import datetime

router = APIRouter()

@router.get("/data")
def get_os_dashboard_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Fetch Native SnapLinks Data
    total_links = db.query(Link).filter(Link.user_id == current_user.id).count()
    total_clicks = db.query(func.sum(Link.clicks)).filter(Link.user_id == current_user.id).scalar() or 0
    total_files = db.query(File).filter(File.user_id == current_user.id).count()
    
    data = {
        "links": {
            "total": total_links,
            "clicks": total_clicks
        },
        "files": {
            "total": total_files
        },
        "google": None
    }
    
    # 2. Fetch Google Data (if connected)
    if current_user.google_access_token:
        headers = {"Authorization": f"Bearer {current_user.google_access_token}"}
        
        # Calendar
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        cal_url = f"https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin={now}&maxResults=3&singleEvents=true&orderBy=startTime"
        try:
            cal_res = requests.get(cal_url, headers=headers)
            events = []
            if cal_res.status_code == 200:
                for item in cal_res.json().get('items', []):
                    events.append({
                        "summary": item.get('summary', 'Busy'),
                        "start": item['start'].get('dateTime', item['start'].get('date')),
                        "link": item.get('htmlLink')
                    })
            
            # Gmail
            gmail_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread in:inbox&maxResults=5"
            gmail_res = requests.get(gmail_url, headers=headers)
            unread_count = 0
            if gmail_res.status_code == 200:
                unread_count = gmail_res.json().get('resultSizeEstimate', 0)
                
            data["google"] = {
                "calendar": events,
                "gmail": {"unread": unread_count}
            }
        except Exception as e:
            pass # Ignore if token expired or revoked for now

    return data
