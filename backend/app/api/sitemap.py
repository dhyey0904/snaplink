from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database.database import get_db
from app.models.bio import BioPage
from app.models.vcard import BusinessCard

router = APIRouter()

@router.get("/sitemap/bio", response_model=List[Dict])
async def get_sitemap_bios(db: Session = Depends(get_db)):
    bios = db.query(BioPage.alias, BioPage.created_at).all()
    return [{"alias": b.alias, "updated_at": b.created_at.isoformat() if b.created_at else None} for b in bios]

@router.get("/sitemap/vcard", response_model=List[Dict])
async def get_sitemap_vcards(db: Session = Depends(get_db)):
    vcards = db.query(BusinessCard.custom_alias).all()
    return [{"alias": v.custom_alias, "updated_at": None} for v in vcards]
