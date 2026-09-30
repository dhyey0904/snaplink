import re

with open('backend/app/api/bridge.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Modify CREATE room to include status
c = c.replace('"expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),', '"expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),\n        "status": "active",')

# Modify DELETE room
old_delete = """        for fid in room["files"]:
            if fid in TRANSFERS:
                t = TRANSFERS[fid]
                t["status"] = "deleted"
                try:
                    if os.path.exists(t["file_path"]):
                        os.remove(t["file_path"])
                except:
                    pass
        del ROOMS[short_code]"""
new_delete = """        room["status"] = "deleted"
        for fid in room["files"]:
            if fid in TRANSFERS:
                t = TRANSFERS[fid]
                t["status"] = "deleted"
                try:
                    if os.path.exists(t["file_path"]):
                        os.remove(t["file_path"])
                except:
                    pass"""
c = c.replace(old_delete, new_delete)

# Modify GET files to check for status
old_get = """    room = ROOMS[short_code]
    if datetime.datetime.utcnow() > room["expires_at"]:
        raise HTTPException(status_code=404, detail="Room expired")"""
new_get = """    room = ROOMS[short_code]
    if room.get("status") == "deleted":
        raise HTTPException(status_code=404, detail="Room deleted by user")
    if datetime.datetime.utcnow() > room["expires_at"]:
        raise HTTPException(status_code=404, detail="Room expired")"""
c = c.replace(old_get, new_get)

with open('backend/app/api/bridge.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed explicit room deletion")
