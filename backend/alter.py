from app.database.database import engine
from sqlalchemy import text

with engine.connect() as con:
    try:
        con.execute(text('ALTER TABLE users ADD COLUMN google_access_token VARCHAR;'))
        con.execute(text('ALTER TABLE users ADD COLUMN google_refresh_token VARCHAR;'))
        con.commit()
        print("Success")
    except Exception as e:
        print("Error:", e)
