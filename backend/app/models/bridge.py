from sqlalchemy import Column, String, Integer, DateTime, Boolean
from app.database.database import Base
import datetime
import uuid

class Transfer(Base):
    __tablename__ = "bridge_transfers"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    short_code = Column(String, unique=True, index=True)
    original_name = Column(String)
    file_path = Column(String)
    mime_type = Column(String)
    size = Column(Integer)
    status = Column(String, default="waiting") # waiting, downloaded, deleting, deleted
    downloaded_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
