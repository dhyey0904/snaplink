from app.database.database import engine
from sqlalchemy import text
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
import secrets
import string

def run():
    with Session(engine) as db:
        try:
            random_pwd = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
            user = User(
                name='Test User',
                email='test@example.com',
                password=get_password_hash(random_pwd),
            )
            db.add(user)
            db.commit()
            print('Successfully created user')
            
            # Cleanup
            conn = engine.connect()
            conn.execute(text("DELETE FROM users WHERE email='test@example.com'"))
            conn.commit()
        except Exception as e:
            print(f'Error creating user: {e}')

if __name__ == '__main__':
    run()
