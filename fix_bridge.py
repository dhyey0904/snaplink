import re
with open('backend/app/api/bridge.py', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('from app.database.database import get_db', 'from app.database.database import get_db, SessionLocal')

fix = """async def async_delete_transfer(transfer_id: str, file_path: str):
    await asyncio.sleep(60)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except:
        pass
    
    db = SessionLocal()
    try:
        t = db.query(Transfer).filter(Transfer.id == transfer_id).first()
        if t:
            t.status = "deleted"
            db.commit()
    finally:
        db.close()"""

c = re.sub(r'async def async_delete_transfer.*?db\.commit\(\)', fix, c, flags=re.DOTALL)
c = c.replace('background_tasks.add_task(async_delete_transfer, transfer.id, transfer.file_path, get_db())', 'background_tasks.add_task(async_delete_transfer, transfer.id, transfer.file_path)')

with open('backend/app/api/bridge.py', 'w', encoding='utf-8') as f:
    f.write(c)
