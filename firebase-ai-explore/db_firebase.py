import os
import psycopg2
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL Connection
DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# Firebase Connection
firebase_key = os.getenv("SERVICE_ACCOUNT_KEY")
cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()

print("✅ PostgreSQL & Firebase connected successfully!")

# Example Query - Fetch Users from PostgreSQL
def fetch_users():
    try:
        cursor.execute("SELECT * FROM users;")  # Ensure 'users' table exists
        users = cursor.fetchall()
        print("Users in PostgreSQL:", users)

        # Store users in Firestore
        for user in users:
            doc_ref = db.collection("users").document(str(user[0]))  # Assuming user[0] is the ID
            doc_ref.set({
                "id": user[0],
                "name": user[1],  # Change based on table structure
                "email": user[2]
            })
        print("✅ Users data added to Firestore!")
    except Exception as e:
        print(f"❌ Error fetching users: {e}")

# Run Example Function
fetch_users()

# Close PostgreSQL Connection
cursor.close()
conn.close()
print("✅ PostgreSQL connection closed.")
