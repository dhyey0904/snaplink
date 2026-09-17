from app.database.database import engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import secrets
import string

def run():
    db = SessionLocal()
    try:
        random_pwd = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
        print("pwd:", random_pwd)
        hashed = get_password_hash(random_pwd)
        print("hashed:", hashed)
        
        user = User(
            name="Test Google User",
            email="test_google_2@example.com",
            password=hashed,
        )
        db.add(user)
        db.commit()
        print("Success")
    except Exception as e:
        print("Error:", e)
    finally:
        db.close()

if __name__ == '__main__':
    run()
