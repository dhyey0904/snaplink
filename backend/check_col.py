from app.database.database import engine
from sqlalchemy import text

def run():
    with engine.connect() as conn:
        try:
            conn.execute(text("SELECT api_key FROM users LIMIT 1"))
            print('api_key column exists')
        except Exception as e:
            print(f'Error: {e}')

if __name__ == '__main__':
    run()
