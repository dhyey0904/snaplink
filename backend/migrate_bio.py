from app.database.database import engine
from sqlalchemy import text

def run_migration():
    with engine.connect() as conn:
        conn.execute(text('ALTER TABLE bio_pages ADD COLUMN contact_email VARCHAR;'))
        conn.commit()
        conn.execute(text('ALTER TABLE bio_pages ADD COLUMN resume_url VARCHAR;'))
        conn.commit()
    print('Migration completed successfully!')

if __name__ == '__main__':
    run_migration()
