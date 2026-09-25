import os
import requests
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.api.auth import get_current_user

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = "http://127.0.0.1:8000/api/integrations/google/callback"

# The scopes we need (read-only for Gmail and Calendar)
SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly"

@router.get("/google/url")
def get_google_auth_url(current_user: User = Depends(get_current_user)):
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope={SCOPES}&"
        f"access_type=offline&"
        f"prompt=consent&"
        f"state={current_user.id}" # We pass the user ID in state to know who is connecting
    )
    return {"url": url}

@router.get("/google/callback")
def google_callback(code: str, state: str, db: Session = Depends(get_db)):
    user_id = int(state)
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    
    res = requests.post(token_url, data=data)
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to get token: {res.text}")
        
    tokens = res.json()
    user.google_access_token = tokens.get("access_token")
    if "refresh_token" in tokens:
        user.google_refresh_token = tokens.get("refresh_token")
        
    db.commit()
    
    # Redirect back to the frontend command center
    return RedirectResponse(url="http://localhost:3000/command-center?google_connected=true")

@router.get("/google/data")
def get_google_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.google_access_token:
        raise HTTPException(status_code=401, detail="Google not connected")
        
    headers = {"Authorization": f"Bearer {current_user.google_access_token}"}
    
    # Fetch Calendar Events (Next 3 upcoming)
    import datetime
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    cal_url = f"https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin={now}&maxResults=3&singleEvents=true&orderBy=startTime"
    cal_res = requests.get(cal_url, headers=headers)
    
    events = []
    if cal_res.status_code == 200:
        for item in cal_res.json().get('items', []):
            events.append({
                "summary": item.get('summary', 'Busy'),
                "start": item['start'].get('dateTime', item['start'].get('date')),
                "link": item.get('htmlLink')
            })
            
    # Fetch Unread Gmail Messages
    gmail_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread in:inbox&maxResults=5"
    gmail_res = requests.get(gmail_url, headers=headers)
    
    unread_count = 0
    if gmail_res.status_code == 200:
        unread_count = gmail_res.json().get('resultSizeEstimate', 0)
        
    return {
        "calendar": events,
        "gmail": {
            "unread": unread_count
        }
    }
