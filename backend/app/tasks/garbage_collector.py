import asyncio
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.file import FileShare

async def cleanup_expired_files_task():
    """
    Background task that sweeps the database every 15 minutes 
    to purge abandoned, expired files from both the disk and the DB.
    """
    print("Garbage Collector: Initialized and waiting for expired files...")
    while True:
        try:
            # We use a new DB session for each sweep to avoid holding connections open
            db: Session = SessionLocal()
            try:
                now = datetime.utcnow()
                # Query all expired files
                expired_files = db.query(FileShare).filter(FileShare.expires_at < now).all()
                
                deleted_count = 0
                for f in expired_files:
                    # 1. Purge from disk to prevent storage leaks
                    if f.file_path and os.path.exists(f.file_path):
                        try:
                            os.remove(f.file_path)
                        except Exception as e:
                            print(f"GC Error: Failed to delete physical file {f.file_path}: {e}")
                    
                    # 2. Remove from database
                    db.delete(f)
                    deleted_count += 1
                
                if deleted_count > 0:
                    db.commit()
                    print(f"Garbage Collector: Successfully purged {deleted_count} abandoned expired file(s).")
                    
            finally:
                db.close()
                
        except Exception as e:
            print(f"Garbage Collector Fatal Error: {e}")
            
        # Sleep for 15 minutes (900 seconds) before the next sweep
        await asyncio.sleep(15 * 60)
