from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    api_key: Optional[str] = None
    api_key_url: Optional[str] = None
    api_key_bio: Optional[str] = None
    api_key_vcard: Optional[str] = None
    api_key_files: Optional[str] = None
    tier: str = "free"
    created_at: datetime

    class Config:
        from_attributes = True
