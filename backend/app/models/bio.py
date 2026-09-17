from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class BioPage(Base):
    __tablename__ = "bio_pages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True) # One bio page per user
    alias = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False, default="My Links")
    bio_text = Column(String, nullable=True)
    theme_color = Column(String, nullable=False, default="#3B82F6") # Default blue
    profile_image_url = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    ad_enabled = Column(Boolean, default=True)
    views = Column(Integer, default=0)
    theme_type = Column(String, default="solid")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", backref="bio_page")
    links = relationship("BioLink", back_populates="bio_page", cascade="all, delete-orphan", order_by="BioLink.order")

class BioLink(Base):
    __tablename__ = "bio_links"

    id = Column(Integer, primary_key=True, index=True)
    bio_page_id = Column(Integer, ForeignKey("bio_pages.id"), nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    clicks = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bio_page = relationship("BioPage", back_populates="links")
