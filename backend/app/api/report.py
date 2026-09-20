from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, HttpUrl
from app.database.database import get_db
from app.models.report import Report

router = APIRouter()

class ReportCreate(BaseModel):
    url: str
    reason: str
    details: str = None

@router.post("/")
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    db_report = Report(url=report.url, reason=report.reason, details=report.details)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return {"message": "Report submitted successfully. Thank you for keeping SnapLink safe."}
