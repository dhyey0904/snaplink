from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_hZmpa2LlwC5G@ep-fragrant-firefly-b5hilv87-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL)
with engine.connect() as con:
    con.execute(text("DROP TABLE IF EXISTS bridge_transfers CASCADE;"))
    con.execute(text("DROP TABLE IF EXISTS bridge_rooms CASCADE;"))
    con.commit()
print("Tables dropped.")
