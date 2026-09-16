import sys
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    from app.database.database import engine, Base
    from app.models import User, Link, Click
    from app.api import auth, links, redirect, analytics, bio
    from sqlalchemy import text
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Safe migration: Add new columns if they don't exist
    migrations = [
        "ALTER TABLE bio_pages ADD COLUMN views INTEGER DEFAULT 0",
        "ALTER TABLE bio_pages ADD COLUMN profile_image_url VARCHAR",
        "ALTER TABLE bio_pages ADD COLUMN ad_enabled BOOLEAN DEFAULT true",
        "ALTER TABLE bio_links ADD COLUMN clicks INTEGER DEFAULT 0",
        "ALTER TABLE users ADD COLUMN api_key VARCHAR"
    ]
    
    for query in migrations:
        try:
            with engine.begin() as conn:
                conn.execute(text(query))
        except Exception:
            pass
    
    app = FastAPI(
        title="SnapLink API",
        description="Backend API for SnapLink URL Shortener",
        version="1.0.0"
    )
    
    # CORS setup
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    def read_root():
        return {"message": "Welcome to SnapLink API"}
    
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(links.router, prefix="/api/links", tags=["links"])
    app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
    app.include_router(bio.router, prefix="/api/bio", tags=["bio"])
    app.include_router(redirect.router, tags=["redirect"])
    
    
except Exception as e:
    print(f"FATAL STARTUP ERROR: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)




