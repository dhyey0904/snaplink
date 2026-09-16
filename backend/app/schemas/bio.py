from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class BioLinkBase(BaseModel):
    title: str
    url: str
    order: Optional[int] = 0
    is_active: Optional[bool] = True

class BioLinkCreate(BioLinkBase):
    pass

class BioLinkUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class BioLinkResponse(BioLinkBase):
    id: int
    bio_page_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BioPageBase(BaseModel):
    alias: str
    title: str
    bio_text: Optional[str] = None
    theme_color: str = "#3B82F6"

class BioPageCreate(BioPageBase):
    pass

class BioPageUpdate(BaseModel):
    alias: Optional[str] = None
    title: Optional[str] = None
    bio_text: Optional[str] = None
    theme_color: Optional[str] = None

class BioPageResponse(BioPageBase):
    id: int
    user_id: int
    created_at: datetime
    links: List[BioLinkResponse] = []

    class Config:
        from_attributes = True
