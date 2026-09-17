from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LinkBase(BaseModel):
    original_url: str
    custom_alias: Optional[str] = None
    expires_at: Optional[datetime] = None
    password: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None

class LinkCreate(LinkBase):
    pass

class LinkUpdate(BaseModel):
    original_url: Optional[str] = None
    expires_at: Optional[datetime] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None

class LinkResponse(BaseModel):
    id: int
    user_id: int
    original_url: str
    short_code: str
    custom_alias: Optional[str]
    expires_at: Optional[datetime]
    is_active: bool
    created_at: datetime
    has_password: bool
    og_title: Optional[str]
    og_description: Optional[str]
    og_image: Optional[str]

    class Config:
        from_attributes = True
