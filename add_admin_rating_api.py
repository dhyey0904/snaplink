import re

file = 'backend/app/api/admin.py'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

imports = "from app.models.file import FileShare\nfrom app.models.rating import Rating"
c = c.replace('from app.models.file import FileShare', imports)

ratings_endpoints = """
@router.get('/ratings')
def get_all_ratings(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    ratings = db.query(Rating).order_by(Rating.created_at.desc()).all()
    result = []
    for r in ratings:
        result.append({
            'id': r.id,
            'stars': r.stars,
            'feedback': r.feedback,
            'created_at': r.created_at
        })
    return result

@router.delete('/ratings/{rating_id}')
def delete_rating(rating_id: int, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    r = db.query(Rating).filter(Rating.id == rating_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Rating not found")
    db.delete(r)
    db.commit()
    return {"message": "Rating deleted successfully"}

"""

c = c + '\n' + ratings_endpoints

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added ratings endpoints to admin API")
