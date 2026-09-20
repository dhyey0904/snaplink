from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any

from app.database.database import get_db
from app.models.user import User
from app.core.email import send_welcome_email
from fastapi import BackgroundTasks
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from datetime import timedelta
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import string
import secrets

router = APIRouter()

class GoogleToken(BaseModel):
    token: str

# You will replace this with your actual Google Client ID
GOOGLE_CLIENT_ID = "234819018700-s05ud8ua2h7eqp9t99jhm8ki6sqircjn.apps.googleusercontent.com"

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        name=user_in.name,
        email=user_in.email,
        password=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google", response_model=Token)
def google_login(token_data: GoogleToken, db: Session = Depends(get_db)) -> Any:
    try:
        idinfo = id_token.verify_oauth2_token(
            token_data.token, google_requests.Request(), GOOGLE_CLIENT_ID
        )
            
        email = idinfo.get("email")
        name = idinfo.get("name", "Google User")
        
        if not email:
            raise HTTPException(status_code=400, detail="Google token missing email")

        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create a new user with a random unguessable password
            random_pwd = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
            
            try:
                hashed_pwd = get_password_hash(random_pwd)
            except Exception as pwd_err:
                raise HTTPException(status_code=401, detail=f"Password hashing failed for string '{random_pwd}' (length {len(random_pwd)}): {str(pwd_err)}")
                
            user = User(
                name=name,
                email=email,
                password=hashed_pwd,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Issue our standard JWT
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError as e:
        import traceback
        tb = traceback.format_exc()
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)} \n\n {tb}")

from app.api.deps import get_current_user

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    return current_user

@router.post("/api-key", response_model=UserResponse)
def generate_api_key(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    if current_user.tier == "free":
        raise HTTPException(
            status_code=403, 
            detail="API access is a Pro feature. Please upgrade your account to generate an API key."
        )

    # Generate secure 32-character API keys
    import secrets
    current_user.api_key = "snap_master_" + secrets.token_urlsafe(32)
    current_user.api_key_url = "snap_url_" + secrets.token_urlsafe(32)
    current_user.api_key_bio = "snap_bio_" + secrets.token_urlsafe(32)
    current_user.api_key_vcard = "snap_vcard_" + secrets.token_urlsafe(32)
    current_user.api_key_files = "snap_files_" + secrets.token_urlsafe(32)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        from jose import jwt
        from datetime import datetime
        # Create a stateless JWT reset token valid for 15 minutes
        expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode = {"sub": user.email, "exp": expire, "type": "reset"}
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
        
        from app.core.email import send_password_reset_email
        background_tasks.add_task(send_password_reset_email, user.email, encoded_jwt)
    
    # Always return success to prevent email enumeration attacks
    return {"message": "If an account with that email exists, we sent a password reset link."}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(request.token, settings.SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")
        token_type = payload.get("type")
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = get_password_hash(request.new_password)
    db.commit()
    return {"message": "Password successfully reset"}
