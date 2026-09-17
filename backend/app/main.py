import sys
import os
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    
    from app.database.database import engine, Base
    from app.models import User, Link, Click
    from app.api import auth, links, redirect, analytics, bio, payment, admin, vcard, click, files
    from sqlalchemy import text
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Safe migration: Add new columns if they don't exist
    migrations = [
        "ALTER TABLE bio_pages ADD COLUMN views INTEGER DEFAULT 0",
        "ALTER TABLE bio_pages ADD COLUMN profile_image_url VARCHAR",
        "ALTER TABLE bio_pages ADD COLUMN ad_enabled BOOLEAN DEFAULT true",
        "ALTER TABLE bio_pages ADD COLUMN theme_type VARCHAR DEFAULT 'solid'",
        "ALTER TABLE bio_links ADD COLUMN clicks INTEGER DEFAULT 0",
        "ALTER TABLE users ADD COLUMN api_key VARCHAR",
        "ALTER TABLE users ADD COLUMN tier VARCHAR DEFAULT 'free'",
        "ALTER TABLE links ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE",
        "ALTER TABLE links ADD COLUMN og_title VARCHAR",
        "ALTER TABLE links ADD COLUMN og_description VARCHAR",
        "ALTER TABLE links ADD COLUMN og_image VARCHAR",
        """
        CREATE TABLE IF NOT EXISTS business_cards (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            custom_alias VARCHAR UNIQUE NOT NULL,
            name VARCHAR,
            company VARCHAR,
            job_title VARCHAR,
            phone VARCHAR,
            email VARCHAR,
            whatsapp VARCHAR,
            portfolio_url VARCHAR,
            social_links VARCHAR, 
            theme_color VARCHAR DEFAULT 'dark',
            views INTEGER DEFAULT 0
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS files (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            filename VARCHAR,
            file_path VARCHAR,
            content_type VARCHAR,
            size_bytes INTEGER,
            short_code VARCHAR UNIQUE,
            password_hash VARCHAR,
            expires_at TIMESTAMP WITH TIME ZONE,
            downloads INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """
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
    
    os.makedirs("uploads", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
    
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(links.router, prefix="/api/links", tags=["links"])
    app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
    app.include_router(bio.router, prefix="/api/bio", tags=["bio"])
    app.include_router(vcard.router, prefix="/api/vcard", tags=["vcard"])
    app.include_router(files.router, prefix="/api/files", tags=["files"])
    app.include_router(payment.router, prefix="/api/payment", tags=["payment"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
    app.include_router(redirect.router, tags=["redirect"])
    
    
except Exception as e:
    print(f"FATAL STARTUP ERROR: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)




