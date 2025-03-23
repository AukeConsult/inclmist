import os
import psycopg2
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL Connection
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("✅ PostgreSQL Connected!")
except Exception as e:
    print(f"❌ PostgreSQL Connection Failed: {e}")

# Firebase Connection
try:
    cred = credentials.Certificate("my_key.json")  # Ensure this file exists
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firestore Connected!")
except Exception as e:
    print(f"❌ Firestore Connection Failed: {e}")

# Test Query - Fetch Users from PostgreSQL
try:
    cursor.execute("SELECT * FROM jobs;")
    jobs = cursor.fetchall()
    print("Jobs in PostgreSQL:", jobs)
except Exception as e:
    print(f"❌ PostgreSQL Query Failed: {e}")

# Close PostgreSQL Connection
cursor.close()
conn.close()
print("🔒 PostgreSQL Connection Closed.")
