from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FileShareBase(BaseModel):
    filename: str
    content_type: str
    size_bytes: int
    short_code: str
    expires_at: Optional[datetime] = None

class FileShareCreate(FileShareBase):
    file_path: str
    password_hash: Optional[str] = None

class FileShareResponse(FileShareBase):
    id: int
    user_id: int
    downloads: int
    created_at: datetime
    has_password: bool # We return boolean instead of the actual hash

    class Config:
        from_attributes = True

class FileVerifyRequest(BaseModel):
    password: Optional[str] = None
