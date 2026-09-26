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
