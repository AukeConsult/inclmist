import os
import google.generativeai as genai
import psycopg2
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# PostgreSQL Connection
DATABASE_URL = os.getenv("DATABASE_URL")  # Format: postgresql://user:password@host:port/dbname
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# Firebase Connection
firebase_key = os.getenv("SERVICE_ACCOUNT_KEY")
cred = credentials.Certificate(firebase_key)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Function to fetch jobs from PostgreSQL
def fetch_jobs(query):
    try:
        sql_query = f"SELECT title, company, location, description FROM jobs WHERE title ILIKE '%{query}%' LIMIT 5;"
        cursor.execute(sql_query)
        jobs = cursor.fetchall()
        
        if not jobs:
            return "No matching jobs found in the database."
        
        job_results = "\n".join([f"🔹 {title} at {company}, {location}\n{description[:100]}..." for title, company, location, description in jobs])
        return job_results
    except Exception as e:
        return f"PostgreSQL Error: {e}"

# Function to query Gemini AI
def query_gemini(user_query, job_data):
    try:
        prompt = f"User is searching for: {user_query}\nHere are some job listings:\n{job_data}\nGenerate a helpful response."
        model = genai.GenerativeModel("gemini-1.5-pro")  # Change to available model
        response = model.generate_content(prompt)
        return response.text if response.text else "No response generated."
    except Exception as e:
        return f"Gemini AI Error: {e}"

# Function to save query & response to Firestore
def save_to_firestore(user_query, ai_response):
    try:
        doc_ref = db.collection("chat_responses").add({
            "query": user_query,
            "response": ai_response
        })
        return "✅ Data stored in Firestore!"
    except Exception as e:
        return f"❌ Firestore Error: {e}"

# Main function
def main():
    user_query = input("Enter your job search query: ")
    
    job_data = fetch_jobs(user_query)
    print("🔎 Job Search Results:\n", job_data)
    
    ai_response = query_gemini(user_query, job_data)
    print("🤖 Gemini AI Response:\n", ai_response)
    
    firestore_status = save_to_firestore(user_query, ai_response)
    print(firestore_status)

# Run the script
if __name__ == "__main__":
    main()

# Close connections
cursor.close()
conn.close()
print("🔌 PostgreSQL connection closed.")
