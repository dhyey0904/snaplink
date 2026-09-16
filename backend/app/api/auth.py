from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any

from app.database.database import get_db
from app.models.user import User
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
            user = User(
                name=name,
                email=email,
                password=get_password_hash(random_pwd),
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

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
