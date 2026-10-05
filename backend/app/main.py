import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import engine, Base
from app.models import User, Link, Click
from app.models.bridge import Transfer, BridgeRoom
from app.api import auth, links, analytics, bio, vcard, files, payment, admin, integrations, rating, redirect, report
from app.api import image, sitemap, bridge, tools
from sqlalchemy import text
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.limiter import limiter

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print("DB CREATE ALL FAILED:", e)

# Safe migration: Add new columns if they don't exist
migrations = [
    "ALTER TABLE bio_pages ADD COLUMN views INTEGER DEFAULT 0",
    "ALTER TABLE bio_pages ADD COLUMN profile_image_url VARCHAR",
    "ALTER TABLE bio_pages ADD COLUMN ad_enabled BOOLEAN DEFAULT true",
    "ALTER TABLE bio_pages ADD COLUMN theme_type VARCHAR DEFAULT 'solid'",
    "ALTER TABLE business_cards ADD COLUMN views INTEGER DEFAULT 0"
]

try:
    with engine.begin() as conn:
        for migration in migrations:
            try:
                conn.execute(text(migration))
            except Exception:
                pass # Column likely exists
except Exception as e:
    print(f"Migration error: {e}")

app = FastAPI(title="SnapLinks API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
COMPRESSED_DIR = os.path.join(UPLOAD_DIR, "compressed")
os.makedirs(COMPRESSED_DIR, exist_ok=True)
app.mount("/compressed", StaticFiles(directory=COMPRESSED_DIR), name="compressed")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(links.router, prefix="/api/links", tags=["links"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(bio.router, prefix="/api/bio", tags=["bio"])
app.include_router(vcard.router, prefix="/api/vcard", tags=["vcard"])
app.include_router(files.router, prefix="/api/files", tags=["files"])
app.include_router(payment.router, prefix="/api/payment", tags=["payment"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["integrations"])
app.include_router(rating.router, prefix="/api", tags=["rating"])
app.include_router(redirect.router, tags=["redirect"])
app.include_router(report.router, prefix="/api/report", tags=["report"])
app.include_router(image.router, prefix="/api/image", tags=["image"])
app.include_router(sitemap.router, prefix="/api", tags=["sitemap"])
app.include_router(bridge.router, prefix="/api/bridge", tags=["bridge"])
app.include_router(tools.router, prefix="/api/tools", tags=["tools"])

@app.get("/")
def read_root():
    return {"message": "Welcome to SnapLinks API"}
