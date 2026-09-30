from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database.database import get_db
from app.models.bio import BioPage
from app.models.vcard import VCard

router = APIRouter()

@router.get("/sitemap/bio", response_model=List[Dict])
async def get_sitemap_bios(db: Session = Depends(get_db)):
    bios = db.query(BioPage.alias, BioPage.created_at).all()
    return [{"alias": b.alias, "updated_at": b.created_at.isoformat() if b.created_at else None} for b in bios]

@router.get("/sitemap/vcard", response_model=List[Dict])
async def get_sitemap_vcards(db: Session = Depends(get_db)):
    vcards = db.query(VCard.alias, VCard.created_at).all()
    return [{"alias": v.alias, "updated_at": v.created_at.isoformat() if v.created_at else None} for v in vcards]
