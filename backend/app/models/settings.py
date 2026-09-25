from sqlalchemy import Column, Integer, Boolean, String
from app.database.database import Base

class SystemSettings(Base):
    __tablename__ = "app_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    maintenance_mode = Column(Boolean, default=False)
    allow_registrations = Column(Boolean, default=True)
    max_upload_size_mb = Column(Integer, default=10)
