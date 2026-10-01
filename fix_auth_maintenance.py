import re

file = 'backend/app/api/auth.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

# Add maintenance mode check to register_user
register_check = """def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    settings = db.query(SystemSettings).first()
    if settings and settings.maintenance_mode:
        raise HTTPException(status_code=503, detail="The system is currently undergoing maintenance. Please try again later.")
    if settings and not settings.allow_registrations:"""

c = c.replace("""def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    settings = db.query(SystemSettings).first()
    if settings and not settings.allow_registrations:""", register_check)


# Add maintenance mode check to login_access_token
login_check = """def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    settings = db.query(SystemSettings).first()
    if settings and settings.maintenance_mode:
        raise HTTPException(status_code=503, detail="The system is currently undergoing maintenance. Logins are temporarily disabled.")
        
    user = db.query"""

c = c.replace("""def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = db.query""", login_check)


# Add maintenance mode check to google_login
google_check = """def google_login(token_data: GoogleToken, db: Session = Depends(get_db)):
    settings = db.query(SystemSettings).first()
    if settings and settings.maintenance_mode:
        raise HTTPException(status_code=503, detail="The system is currently undergoing maintenance. Logins are temporarily disabled.")
        
    try:"""

c = c.replace("""def google_login(token_data: GoogleToken, db: Session = Depends(get_db)):
    try:""", google_check)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Enforced maintenance mode on auth routes")
