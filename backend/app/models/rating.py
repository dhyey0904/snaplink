from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    stars = Column(Integer, nullable=False)
    feedback = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
