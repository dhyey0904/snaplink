from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class BioLinkBase(BaseModel):
    title: str
    url: str
    order: Optional[int] = 0
    is_active: Optional[bool] = True

class BioLinkCreate(BioLinkBase):
    link_type: Optional[str] = "link"
    metadata_json: Optional[str] = None

class BioLinkUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class BioLinkResponse(BioLinkCreate):
    id: int
    bio_page_id: int
    clicks: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

class BioPageBase(BaseModel):
    alias: str
    title: str
    bio_text: Optional[str] = None
    theme_color: str = "#3B82F6"
    profile_image_url: Optional[str] = None
    contact_email: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    ad_enabled: bool = True
    theme_type: str = "solid"
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None

class BioPageCreate(BioPageBase):
    pass

class BioPageUpdate(BaseModel):
    alias: Optional[str] = None
    title: Optional[str] = None
    bio_text: Optional[str] = None
    theme_color: Optional[str] = None
    profile_image_url: Optional[str] = None
    contact_email: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    ad_enabled: Optional[bool] = None
    theme_type: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None

class BioPageResponse(BioPageBase):
    id: int
    user_id: int
    views: int = 0
    created_at: datetime
    links: List[BioLinkResponse] = []

    class Config:
        from_attributes = True

