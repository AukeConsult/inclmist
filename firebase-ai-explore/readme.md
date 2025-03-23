# 🚀 Firebase-AI Integration with PostgreSQL & Gemini AI

This project integrates **PostgreSQL with Google Cloud Firestore** and **Gemini AI** to process job search queries.  
When a user enters a job-related query, the system:  
👉 Searches **PostgreSQL** for relevant job data.  
👉 Uses **Gemini AI** to process the query.  
👉 Stores the results in **Firestore** for further usage.  

---

## 📌 **1. Prerequisites**
Ensure you have the following installed:  
- ✅ **Python 3.9+**  
- ✅ **Google Cloud SDK** (`gcloud`)  
- ✅ **PostgreSQL (Cloud Instance)**  
- ✅ **Google Cloud Firestore** (Database must be created)  
- ✅ **Service Account Key** for Firebase  

---

## 🔧 **2. Setup Guide**
### **Step 1: Clone the Repository**
```sh
git clone https://github.com/your-repo/firebase-ai-integration.git
cd firebase-ai-integration
```

### **Step 2: Create a Virtual Environment & Install Dependencies**
```sh
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### **Step 3: Configure PostgreSQL (Google Cloud)**
Ensure your PostgreSQL instance is running and accessible.  
Update the `.env` file with your database credentials:

```ini
DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@<PUBLIC_IP>:5432/postgres
```

### **Step 4: Set Up Firebase**
1. **Enable Firestore in Firebase**  
   - Go to **[Firebase Console](https://console.firebase.google.com/)**
   - Select your project.
   - Navigate to **Firestore Database** → Click **Create Database**.

2. **Download Firebase Admin SDK Key**  
   - Go to **Project Settings** → **Service Accounts**.
   - Click **Generate new private key**.
   - Save it as `firebase_key.json` in the project root.

3. **Set up environment variables for Firebase**
   ```ini
   FIREBASE_CREDENTIALS=firebase_key.json
   ```

### **Step 5: Enable Gemini AI (Google AI)**
1. **Enable Gemini API**  
   ```sh
   gcloud services enable aiplatform.googleapis.com
   ```
2. **Generate API Key**  
   - Go to **Google Cloud Console** → **APIs & Services** → **Credentials**.  
   - Click **Create API Key** and copy it.  
   - Add it to your `.env` file:
     ```ini
     GEMINI_API_KEY=your_gemini_api_key
     ```

---

## 🚀 **3. Running the Application**
### **Start the Query Processing**
Run the script to process job queries:
```sh
python chat_query.py
```
Example output:
```sh
Enter your job search query: software engineer at Google

🔎 Job Search Results:
 🔹 Software Engineer at Google, Mountain View, CA
   Develop software applications....

🤖 Gemini AI Response:
   "Based on your query, here are some job recommendations...."

✅ Data stored in Firestore!
🐐 PostgreSQL connection closed.
```

---

## 🔦 **4. File Structure**
```
firebase-ai-integration/
👉 chat_query.py        # Main script for query processing
👉 db_postgres.py       # PostgreSQL connection handler
👉 db_firebase.py       # Firestore connection handler
👉 firebase_key.json    # Firebase Service Account Key
👉 .env                 # Environment variables
👉 requirements.txt     # Required dependencies
👉 README.md            # Project documentation
```

---

## 🛠 **5. Troubleshooting**
### ❌ Firestore Error: "Missing or insufficient permissions"
👉 Solution:  
- Ensure **Firestore is created** in Firebase.  
- Check `firebase_key.json` file permissions.  

### ❌ PostgreSQL Error: "Connection refused"
👉 Solution:  
- Ensure **Cloud SQL instance is running**.  
- Check **DATABASE_URL** format in `.env`.

### ❌ Gemini AI Error: "Model not found"
👉 Solution:  
- Ensure Gemini AI API is **enabled in Google Cloud**.  
- Use `gcloud services enable aiplatform.googleapis.com`.

---

## 🎯 **6. Next Steps**
- ✅ Convert this into a **FastAPI backend** to serve job search queries via an API.
- ✅ Optimize Firestore queries for better performance.
- ✅ Implement **scheduled jobs** using Google Cloud Scheduler.


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# Firebase-PostgreSQL-Gemini Integration Guide

## Overview
This guide provides step-by-step instructions to integrate Firebase, PostgreSQL, and Gemini AI to process job search queries. The integration will:
1. Connect PostgreSQL with Firebase.
2. Use Firebase Cloud Functions to handle API requests.
3. Process job search queries with Gemini AI.
4. Store and retrieve processed data from Firestore.

---

## Project Folder Structure
```
Firebase-Postgres-Gemini/
│── firebase.json
│── .firebaserc
│── README.md
│── functions/
│   │── index.js
│   │── package.json
│   │── package-lock.json
│   │── .env
│   │── my_key.json
│   │── node_modules/
│── firestore.rules
│── database/
│   │── init.sql
│   │── seed.sql
│── public/
│── src/
```

---

## Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **Firebase CLI** (`npm install -g firebase-tools`)
- **PostgreSQL Database** (hosted on Google Cloud SQL or local)
- **Google Cloud Account** (for Gemini API access)

---

## Step 1: Set Up Firebase Project
1. **Login to Firebase CLI:**
   ```sh
   firebase login
   ```
2. **Initialize Firebase Project:**
   ```sh
   firebase init
   ```
   - Select **Functions** and **Firestore**.
   - Choose **JavaScript** as the language.
   - Enable **Emulators** if testing locally.

3. **Navigate to the `functions/` Directory:**
   ```sh
   cd functions
   ```

---

## Step 2: Install Required Dependencies
Run the following inside the `functions/` directory:
```sh
npm install firebase-admin firebase-functions dotenv pg axios
```

- `firebase-admin`: Firebase Admin SDK for Firestore.
- `firebase-functions`: Firebase Cloud Functions SDK.
- `dotenv`: For managing environment variables.
- `pg`: PostgreSQL client for Node.js.
- `axios`: For making API calls (Gemini AI).

---

## Step 3: Configure Environment Variables
Create a `.env` file in the `functions/` directory:
```ini
PG_USER=your_pg_user
PG_HOST=your_pg_host
PG_DATABASE=your_pg_database
PG_PASSWORD=your_pg_password
PG_PORT=5432
GEMINI_API_KEY=your_gemini_api_key
```
**Note:** Never commit `.env` files to version control.

---

## Step 4: Setup Firebase Configuration
Create a `firebase.json` file in the root directory:
```json
{
  "functions": {
    "source": "functions"
  }
}
```

---

## Step 5: Setup PostgreSQL Connection
Modify `index.js` inside `functions/`:
```js
require('dotenv').config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Pool } = require("pg");
const axios = require("axios");
const path = require("path");

const serviceAccountPath = path.resolve(__dirname, "my_key.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
```

---

## Step 6: Implement Job Search API with Gemini AI
```js
exports.realtimeJobSearch = functions.https.onRequest(async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing job search query." });
    }

    // Query PostgreSQL for job data
    const jobQuery = "SELECT * FROM jobs WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 10";
    const values = [`%${query}%`];
    const result = await pool.query(jobQuery, values);

    // Process query with Gemini AI
    const aiResponse = await axios.post(
      "https://gemini-api-url", 
      { prompt: `Summarize these job results: ${JSON.stringify(result.rows)}` },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );

    // Save query & AI response to Firestore
    await db.collection("job_queries").add({
      query,
      results: result.rows,
      aiSummary: aiResponse.data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ jobs: result.rows, summary: aiResponse.data });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
```

---

## Step 7: Deploy and Test the Function
1. **Deploy to Firebase:**
   ```sh
   firebase deploy --only functions
   ```
2. **Test API Using cURL or Postman:**
   ```sh
   curl -X POST https://<your-cloud-function-url>/realtimeJobSearch \
   -H "Content-Type: application/json" \
   -d '{"query": "Software Engineer"}'
   ```

---

## Step 8: Schedule PostgreSQL Connection Cleanup
Modify `index.js` to include scheduled cleanup:
```js
const { onSchedule } = require("firebase-functions/v2/scheduler");
exports.cleanup = onSchedule("every 24 hours", async () => {
  console.log("Closing PostgreSQL connections...");
  await pool.end();
  console.log("PostgreSQL connections closed.");
});
```
Deploy the scheduled function:
```sh
firebase deploy --only functions
```

---

## Troubleshooting
### 1. **Error: Cannot find module 'dotenv'**
   - Run `npm install dotenv` inside the `functions/` directory.

### 2. **Error: Cannot find module 'pg'**
   - Run `npm install pg` inside the `functions/` directory.

### 3. **Error: TypeError: functions.pubsub.schedule is not a function**
   - Use `firebase-functions/v2/scheduler` instead of `functions.pubsub.schedule`.

### 4. **Error: FirebaseError: Could not deploy functions because the "functions" directory was not found**
   - Ensure that `firebase.json` contains:
     ```json
     {
       "functions": {
         "source": "functions"
       }
     }
     ```
   - Ensure you are inside the correct directory (`cd functions`) when deploying.

### 5. **Function ignored because the pubsub emulator does not exist or is not running**
   - Run the Firebase emulator if testing locally:
     ```sh
     firebase emulators:start --only functions
     ```

### 6. Resolve ESLint errors: 
    npm run lint -- --fix
    firebase deploy --only functions
    gcloud functions delete function_name
---

## Troubleshooting
### 1. **ESLint Issues During Deployment**
If you get ESLint errors like:
```sh
error  Strings must use doublequote  quotes
error  There should be no space after '{'  object-curly-spacing
```
Fix them automatically by running:
```sh
npm run lint -- --fix
```
Or manually correct them in `index.js`.

### 2. **Line Length Exceeds Maximum Limit**
If you see:
```sh
error  This line has a length of 96. Maximum allowed is 80  max-len
```
Break long lines into multiple lines to fit within 80 characters.

### 3. **Cloud Scheduler API Not Enabled**
If you get:
```sh
Error: Failed to make request to https://serviceusage.googleapis.com/v1/projects/<project-id>/services/cloudscheduler.googleapis.com:enable
```
Manually enable Cloud Scheduler API:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services > Library**.
3. Search for **Cloud Scheduler API** and enable it.

### 4. **Error: Function Ignored Because Emulator Not Running**
If you see:
```sh
Function ignored because the pubsub emulator does not exist or is not running
```
Start the Firebase emulator:
```sh
firebase emulators:start --only functions
```

---
