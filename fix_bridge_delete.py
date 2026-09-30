import re

with open('backend/app/api/bridge.py', 'r', encoding='utf-8') as f:
    c = f.read()

delete_endpoint = """
@router.delete("/room/{short_code}")
async def delete_room(short_code: str):
    if short_code in ROOMS:
        room = ROOMS[short_code]
        # Mark all files as deleted and delete them from disk
        for fid in room["files"]:
            if fid in TRANSFERS:
                t = TRANSFERS[fid]
                t["status"] = "deleted"
                try:
                    if os.path.exists(t["file_path"]):
                        os.remove(t["file_path"])
                except:
                    pass
        del ROOMS[short_code]
    return {"success": True}
"""

c = c.replace('@router.get("/download/{transfer_id}")', delete_endpoint + '\n@router.get("/download/{transfer_id}")')

with open('backend/app/api/bridge.py', 'w', encoding='utf-8') as f:
    f.write(c)
