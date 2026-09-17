from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.token import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

from fastapi import Depends, HTTPException, status, Security, Request
from sqlalchemy import or_

def get_current_user(
    request: Request,
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme),
    api_key: str = Security(api_key_header)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if api_key:
        user = db.query(User).filter(
            or_(
                User.api_key == api_key,
                User.api_key_url == api_key,
                User.api_key_bio == api_key,
                User.api_key_vcard == api_key,
                User.api_key_files == api_key
            )
        ).first()
        
        if user:
            if user.tier == "free":
                raise HTTPException(status_code=403, detail="API access requires a Pro subscription.")
                
            path = request.url.path
            if api_key == user.api_key:
                pass # Master key works anywhere
            elif api_key == user.api_key_url and not path.startswith("/api/links"):
                raise HTTPException(status_code=403, detail="This API key is restricted to the URL Shortener service.")
            elif api_key == user.api_key_bio and not path.startswith("/api/bio"):
                raise HTTPException(status_code=403, detail="This API key is restricted to the Bio Builder service.")
            elif api_key == user.api_key_vcard and not path.startswith("/api/vcard"):
                raise HTTPException(status_code=403, detail="This API key is restricted to the vCard service.")
            elif api_key == user.api_key_files and not path.startswith("/api/files"):
                raise HTTPException(status_code=403, detail="This API key is restricted to the File Sharing service.")
                
            return user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key")
        
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception
        
        user = db.query(User).filter(User.email == token_data.email).first()
        if user is None:
            raise credentials_exception
        return user

    raise credentials_exception
