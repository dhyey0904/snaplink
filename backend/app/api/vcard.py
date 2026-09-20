from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.vcard import BusinessCard
from app.schemas.vcard import VCardCreate, VCardResponse
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=VCardResponse)
def create_or_update_vcard(vcard_in: VCardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if a card already exists for this user
    card = db.query(BusinessCard).filter(BusinessCard.user_id == current_user.id).first()
    
    if card:
        # Check alias uniqueness if changing
        if card.custom_alias != vcard_in.custom_alias:
            existing_alias = db.query(BusinessCard).filter(BusinessCard.custom_alias == vcard_in.custom_alias).first()
            if existing_alias:
                raise HTTPException(status_code=400, detail="Alias already taken")
        
        # Update existing
        for key, value in vcard_in.model_dump().items():
            setattr(card, key, value)
    else:
        # Check alias uniqueness for new card
        existing_alias = db.query(BusinessCard).filter(BusinessCard.custom_alias == vcard_in.custom_alias).first()
        if existing_alias:
            raise HTTPException(status_code=400, detail="Alias already taken")
            
        card = BusinessCard(user_id=current_user.id, **vcard_in.model_dump())
        db.add(card)
        
    db.commit()
    db.refresh(card)
    return card

@router.get("/me", response_model=VCardResponse)
def get_my_vcard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = db.query(BusinessCard).filter(BusinessCard.user_id == current_user.id).first()
    if not card:
        raise HTTPException(status_code=404, detail="No business card found")
    return card

@router.get("/{alias}", response_model=VCardResponse)
def get_vcard_public(alias: str, db: Session = Depends(get_db)):
    card = db.query(BusinessCard).filter(BusinessCard.custom_alias == alias).first()
    if not card:
        raise HTTPException(status_code=404, detail="Business card not found")
        
    # Increment view count
    card.views += 1
    db.commit()
    db.refresh(card)
    
    return card
