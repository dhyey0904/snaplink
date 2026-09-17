from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.database import Base

class BusinessCard(Base):
    __tablename__ = "business_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    custom_alias = Column(String, unique=True, index=True)
    
    name = Column(String, nullable=True)
    company = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    
    portfolio_url = Column(String, nullable=True)
    social_links = Column(String, nullable=True) # Stored as JSON string
    
    theme_color = Column(String, default="dark")
    views = Column(Integer, default=0)
