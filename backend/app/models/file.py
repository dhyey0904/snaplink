from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base

class FileShare(Base):
    __tablename__ = "files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    filename = Column(String)
    file_path = Column(String) # relative to backend/uploads
    content_type = Column(String)
    size_bytes = Column(Integer)
    short_code = Column(String, unique=True, index=True)
    
    password_hash = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    downloads = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
