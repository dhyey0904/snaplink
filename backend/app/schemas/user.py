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
    tier: str = "free"
    created_at: datetime

    class Config:
        from_attributes = True
