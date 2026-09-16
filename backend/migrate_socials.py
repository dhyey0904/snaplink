from app.database.database import engine
from sqlalchemy import text

def run_migration():
    with engine.connect() as conn:
        conn.execute(text('ALTER TABLE bio_pages ADD COLUMN github_url VARCHAR;'))
        conn.commit()
        conn.execute(text('ALTER TABLE bio_pages ADD COLUMN twitter_url VARCHAR;'))
        conn.commit()
        conn.execute(text('ALTER TABLE bio_pages ADD COLUMN instagram_url VARCHAR;'))
        conn.commit()
        conn.execute(text('ALTER TABLE bio_pages ADD COLUMN linkedin_url VARCHAR;'))
        conn.commit()
    print('Migration completed successfully!')

if __name__ == '__main__':
    run_migration()
