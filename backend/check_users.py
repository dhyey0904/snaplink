from app.database.database import engine
from sqlalchemy import text

def run():
    with engine.connect() as conn:
        res = conn.execute(text("SELECT email FROM users"))
        for row in res:
            print(row)

if __name__ == '__main__':
    run()
