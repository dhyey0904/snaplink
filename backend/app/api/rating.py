from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.rating import Rating
from pydantic import BaseModel

router = APIRouter()

class RatingCreate(BaseModel):
    stars: int
    feedback: str = None

@router.post("/")
def submit_rating(rating: RatingCreate, db: Session = Depends(get_db)):
    if rating.stars < 1 or rating.stars > 5:
        return {"error": "Invalid rating"}
    db_rating = Rating(stars=rating.stars, feedback=rating.feedback)
    db.add(db_rating)
    db.commit()
    return {"message": "Rating submitted successfully"}

from sqlalchemy.sql import func

@router.get("/summary")
def get_rating_summary(db: Session = Depends(get_db)):
    result = db.query(func.avg(Rating.stars).label("average"), func.count(Rating.id).label("count")).first()
    if not result or result.count == 0:
        return {"average": 5.0, "count": 1} # Fallback seed
    
    return {
        "average": round(result.average, 1),
        "count": result.count
    }
