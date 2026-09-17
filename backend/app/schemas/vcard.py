from pydantic import BaseModel
from typing import Optional

class VCardBase(BaseModel):
    custom_alias: str
    name: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    whatsapp: Optional[str] = None
    portfolio_url: Optional[str] = None
    social_links: Optional[str] = None
    theme_color: Optional[str] = "dark"

class VCardCreate(VCardBase):
    pass

class VCardResponse(VCardBase):
    id: int
    user_id: int
    views: int

    class Config:
        from_attributes = True
