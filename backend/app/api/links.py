from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
import string
import secrets

from app.database.database import get_db
from app.models.link import Link
from app.models.user import User
from app.schemas.link import LinkCreate, LinkUpdate, LinkResponse
from app.api.deps import get_current_user
from app.core.limiter import limiter
from fastapi import Request
from app.core.security import get_password_hash

router = APIRouter()

def generate_short_code(length: int = 6) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

@router.post("/guest", response_model=LinkResponse)
@limiter.limit("10/hour")
def create_guest_link(
    request: Request,
    link_in: LinkCreate,
    db: Session = Depends(get_db)
) -> Any:
    if link_in.custom_alias:
        raise HTTPException(status_code=400, detail="Custom aliases require an account.")
        
    while True:
        short_code = generate_short_code()
        existing = db.query(Link).filter(Link.short_code == short_code).first()
        if not existing:
            break

    db_link = Link(
        user_id=None,
        original_url=link_in.original_url,
        short_code=short_code,
    )

    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    
    db_link.has_password = False
    return db_link

@router.post("/", response_model=LinkResponse)
@limiter.limit("30/minute")
def create_link(
    request: Request,
    link_in: LinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    if not link_in.custom_alias:
        raise HTTPException(status_code=400, detail="A custom short code is required.")
        
    # Check if alias is already taken
    existing = db.query(Link).filter(
        (Link.short_code == link_in.custom_alias) | 
        (Link.custom_alias == link_in.custom_alias)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="This short code is already taken. Please choose another.")
    
    # Use the user's custom alias as the main short code
    short_code = link_in.custom_alias

    db_link = Link(
        user_id=current_user.id,
        original_url=link_in.original_url,
        short_code=short_code,
        custom_alias=short_code,
        expires_at=link_in.expires_at,
        og_title=getattr(link_in, 'og_title', None),
        og_description=getattr(link_in, 'og_description', None),
        og_image=getattr(link_in, 'og_image', None),
    )

    if link_in.password:
        db_link.password_hash = get_password_hash(link_in.password)

    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    
    # Dynamically add has_password field for the response model
    db_link.has_password = bool(db_link.password_hash)
    return db_link

@router.get("/", response_model=List[LinkResponse])
def read_links(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    links = db.query(Link).filter(Link.user_id == current_user.id).all()
    for link in links:
        link.has_password = bool(link.password_hash)
    return links

@router.delete("/{id}", response_model=dict)
def delete_link(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    link = db.query(Link).filter(Link.id == id, Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    # Soft delete by setting is_active to False
    link.is_active = False
    db.commit()
    return {"message": "Link deleted successfully (soft delete)"}

@router.put("/{id}", response_model=LinkResponse)
def update_link(
    id: int,
    link_in: LinkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    link = db.query(Link).filter(Link.id == id, Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    if link_in.password:
        if link_in.password == "REMOVE":
            link.password_hash = None
        else:
            link.password_hash = get_password_hash(link_in.password)
            
    # Update all other provided fields dynamically
    update_data = link_in.model_dump(exclude_unset=True, exclude={"password"})
    for field, value in update_data.items():
        setattr(link, field, value)
        
    db.commit()
    db.refresh(link)
    link.has_password = bool(link.password_hash)
    return link
