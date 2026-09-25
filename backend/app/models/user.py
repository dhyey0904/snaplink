from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    api_key = Column(String, unique=True, index=True, nullable=True) # Master key
    api_key_url = Column(String, unique=True, index=True, nullable=True)
    api_key_bio = Column(String, unique=True, index=True, nullable=True)
    api_key_vcard = Column(String, unique=True, index=True, nullable=True)
    api_key_files = Column(String, unique=True, index=True, nullable=True)
    
    # OAuth Tokens for Snap OS
    google_access_token = Column(String, nullable=True)
    google_refresh_token = Column(String, nullable=True)
    
    tier = Column(String, default="free")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
