from sqlalchemy import create_engine
import os

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://neondb_owner:n8QjZzOhFv6H@ep-black-star-a5w3uug3.us-east-2.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL)
with engine.connect() as con:
    con.execute("DROP TABLE IF EXISTS bridge_transfers CASCADE;")
    con.execute("DROP TABLE IF EXISTS bridge_rooms CASCADE;")
print("Dropped old tables")
