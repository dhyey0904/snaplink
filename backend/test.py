from app.database.database import engine
from sqlalchemy import text
conn = engine.connect()
res = conn.execute(text("SELECT alias, contact_email FROM bio_pages WHERE alias='raja'"))
print(res.fetchall())
