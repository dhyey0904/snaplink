from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from app.database.database import Base
import datetime
import uuid

class BridgeRoom(Base):
    __tablename__ = "bridge_rooms"
    room_code = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime)

class Transfer(Base):
    __tablename__ = "bridge_transfers"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    room_code = Column(String, ForeignKey("bridge_rooms.room_code"))
    original_name = Column(String)
    file_path = Column(String)
    mime_type = Column(String)
    size = Column(Integer)
    status = Column(String, default="waiting") # waiting, downloaded, deleting, deleted
    downloaded_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
