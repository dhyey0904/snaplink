import re

with open('backend/app/api/bridge.py', 'r', encoding='utf-8') as f:
    c = f.read()

delete_file_endpoint = """
@router.delete("/file/{transfer_id}")
async def delete_file(transfer_id: str):
    if transfer_id in TRANSFERS:
        t = TRANSFERS[transfer_id]
        t["status"] = "deleted"
        try:
            if os.path.exists(t["file_path"]):
                os.remove(t["file_path"])
        except:
            pass
    return {"success": True}
"""

c = c.replace('@router.get("/download/{transfer_id}")', delete_file_endpoint + '\n@router.get("/download/{transfer_id}")')

with open('backend/app/api/bridge.py', 'w', encoding='utf-8') as f:
    f.write(c)
