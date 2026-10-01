import re

file = 'backend/app/api/auth.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

imports = "from app.models.user import User\nfrom app.models.settings import SystemSettings"
c = c.replace('from app.models.user import User', imports)

register_check = """def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    settings = db.query(SystemSettings).first()
    if settings and not settings.allow_registrations:
        raise HTTPException(status_code=403, detail="New registrations are currently disabled by the administrator.")
        
    user = db.query"""

c = c.replace("def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:\n    user = db.query", register_check)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Enforced allow_registrations setting")
