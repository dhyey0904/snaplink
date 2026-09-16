from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from app.database.database import get_db
from app.models.bio import BioPage, BioLink
from app.models.user import User
from app.schemas.bio import BioPageCreate, BioPageUpdate, BioPageResponse, BioLinkCreate, BioLinkUpdate, BioLinkResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=BioPageResponse)
def get_my_bio_page(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    bio_page = db.query(BioPage).filter(BioPage.user_id == current_user.id).first()
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    return bio_page

@router.post("/", response_model=BioPageResponse)
def create_bio_page(
    bio_in: BioPageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    existing = db.query(BioPage).filter(BioPage.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a bio page")
    
    # Check if alias is taken by someone else
    alias_taken = db.query(BioPage).filter(BioPage.alias == bio_in.alias).first()
    if alias_taken:
        raise HTTPException(status_code=400, detail="This alias is already taken")
        
    bio_page = BioPage(
        user_id=current_user.id,
        alias=bio_in.alias,
        title=bio_in.title,
        bio_text=bio_in.bio_text,
        theme_color=bio_in.theme_color,
        profile_image_url=bio_in.profile_image_url,
        contact_email=bio_in.contact_email,
        resume_url=bio_in.resume_url,
        ad_enabled=bio_in.ad_enabled
    )
    db.add(bio_page)
    db.commit()
    db.refresh(bio_page)
    return bio_page

@router.put("/", response_model=BioPageResponse)
def update_bio_page(
    bio_in: BioPageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    bio_page = db.query(BioPage).filter(BioPage.user_id == current_user.id).first()
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
        
    if bio_in.alias is not None and bio_in.alias != bio_page.alias:
        alias_taken = db.query(BioPage).filter(BioPage.alias == bio_in.alias).first()
        if alias_taken:
            raise HTTPException(status_code=400, detail="This alias is already taken")
        bio_page.alias = bio_in.alias
        
    if bio_in.title is not None:
        bio_page.title = bio_in.title
    if bio_in.bio_text is not None:
        bio_page.bio_text = bio_in.bio_text
    if bio_in.theme_color is not None:
        bio_page.theme_color = bio_in.theme_color
    if bio_in.profile_image_url is not None:
        bio_page.profile_image_url = bio_in.profile_image_url
    if bio_in.contact_email is not None:
        bio_page.contact_email = bio_in.contact_email
    if bio_in.resume_url is not None:
        bio_page.resume_url = bio_in.resume_url
    if bio_in.ad_enabled is not None:
        bio_page.ad_enabled = bio_in.ad_enabled
        
    db.commit()
    db.refresh(bio_page)
    return bio_page

@router.post("/links", response_model=BioLinkResponse)
def add_bio_link(
    link_in: BioLinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    bio_page = db.query(BioPage).filter(BioPage.user_id == current_user.id).first()
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
        
    bio_link = BioLink(
        bio_page_id=bio_page.id,
        title=link_in.title,
        url=link_in.url,
        order=link_in.order,
        is_active=link_in.is_active
    )
    db.add(bio_link)
    db.commit()
    db.refresh(bio_link)
    return bio_link

@router.put("/links/{link_id}", response_model=BioLinkResponse)
def update_bio_link(
    link_id: int,
    link_in: BioLinkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    bio_page = db.query(BioPage).filter(BioPage.user_id == current_user.id).first()
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
        
    bio_link = db.query(BioLink).filter(BioLink.id == link_id, BioLink.bio_page_id == bio_page.id).first()
    if not bio_link:
        raise HTTPException(status_code=404, detail="Link not found")
        
    if link_in.title is not None:
        bio_link.title = link_in.title
    if link_in.url is not None:
        bio_link.url = link_in.url
    if link_in.order is not None:
        bio_link.order = link_in.order
    if link_in.is_active is not None:
        bio_link.is_active = link_in.is_active
        
    db.commit()
    db.refresh(bio_link)
    return bio_link

@router.delete("/links/{link_id}")
def delete_bio_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    bio_page = db.query(BioPage).filter(BioPage.user_id == current_user.id).first()
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
        
    bio_link = db.query(BioLink).filter(BioLink.id == link_id, BioLink.bio_page_id == bio_page.id).first()
    if not bio_link:
        raise HTTPException(status_code=404, detail="Link not found")
        
    db.delete(bio_link)
    db.commit()
    return {"message": "Link deleted successfully"}

# PUBLIC ENDPOINT (No authentication required)
@router.get("/public/{alias}", response_model=BioPageResponse)
def get_public_bio_page(
    alias: str,
    db: Session = Depends(get_db)
) -> Any:
    bio_page = db.query(BioPage).filter(BioPage.alias == alias).first()
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Create a dict to avoid mutating the SQLAlchemy model
    response_data = {
        "id": bio_page.id,
        "user_id": bio_page.user_id,
        "alias": bio_page.alias,
        "title": bio_page.title,
        "bio_text": bio_page.bio_text,
        "theme_color": bio_page.theme_color,
        "profile_image_url": bio_page.profile_image_url,
        "ad_enabled": bio_page.ad_enabled,
        "views": bio_page.views,
        "created_at": bio_page.created_at,
        "links": [link for link in bio_page.links if link.is_active]
    }
    return response_data

@router.post("/public/{alias}/view")
def increment_bio_view(
    alias: str,
    db: Session = Depends(get_db)
) -> Any:
    bio_page = db.query(BioPage).filter(BioPage.alias == alias).first()
    if bio_page:
        bio_page.views = (bio_page.views or 0) + 1
        db.commit()
    return {"status": "ok"}

@router.post("/public/links/{link_id}/click")
def increment_bio_link_click(
    link_id: int,
    db: Session = Depends(get_db)
) -> Any:
    bio_link = db.query(BioLink).filter(BioLink.id == link_id).first()
    if bio_link:
        bio_link.clicks = (bio_link.clicks or 0) + 1
        db.commit()
    return {"status": "ok"}
