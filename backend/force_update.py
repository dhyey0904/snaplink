from app.database.database import engine
from sqlalchemy import text

def run():
    with engine.connect() as conn:
        conn.execute(text("UPDATE bio_pages SET contact_email = 'dhyey@example.com' WHERE alias = 'dhyey'"))
        conn.commit()
    print('Updated successfully')

if __name__ == '__main__':
    run()
