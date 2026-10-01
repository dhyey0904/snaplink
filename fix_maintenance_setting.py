import re

file = 'backend/app/api/redirect.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

imports = "from app.models.click import Click\nfrom app.models.settings import SystemSettings"
c = c.replace('from app.models.click import Click', imports)

old_check = """def redirect_short_code(short_code: str, request: Request, db: Session = Depends(get_db)):
    # 1. Check if it's a bio page
    bio = db.query(BioPage).filter(BioPage.custom_alias == short_code).first()"""

new_check = """def redirect_short_code(short_code: str, request: Request, db: Session = Depends(get_db)):
    settings = db.query(SystemSettings).first()
    if settings and settings.maintenance_mode:
        raise HTTPException(status_code=503, detail="Service is currently under maintenance. Please try again later.")

    # 1. Check if it's a bio page
    bio = db.query(BioPage).filter(BioPage.custom_alias == short_code).first()"""

c = c.replace(old_check, new_check)
with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Enforced maintenance_mode setting in redirect")
