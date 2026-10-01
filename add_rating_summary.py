import re

file = 'backend/app/api/rating.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

summary_endpoint = """
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
"""

c = c + summary_endpoint

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added /rating/summary endpoint")
