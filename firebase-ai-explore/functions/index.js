// Load environment variables from .env file
require("dotenv").config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Pool} = require("pg");
const path = require("path");

// ✅ Validate required environment variables
const requiredEnv = [
  "PG_USER",
  "PG_HOST",
  "PG_DATABASE",
  "PG_PASSWORD",
  "PG_PORT",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env: ${key}`);
    process.exit(1);
  }
});

// ✅ Load the service account key securely
const serviceAccountPath = path.resolve(__dirname, "my_key.json");
let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error("❌ Error loading service account key:", error);
  process.exit(1);
}

// ✅ Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("❌ Firebase Admin init failed:", error);
  process.exit(1);
}

const db = admin.firestore();

// ✅ Configure PostgreSQL connection pool with error handling
let pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  max: 10, // Limit connections to prevent overload
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Fail fast on connection issues
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err);
});

// 🔥 Firestore Function: Listen for Real-Time Queries
exports.realtimeJobSearch = functions.https.onRequest(async (req, res) => {
  try {
    const {query} = req.body;
    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return res.status(400).json({
        error: "Invalid job search query. Must be at least 3 characters.",
      });
    }

    console.log(`🔎 Searching for jobs related to: ${query}`);

    // Query PostgreSQL for job data
    const jobQuery =
      "SELECT * FROM jobs WHERE title ILIKE $1 OR description ILIKE $1 " +
      "LIMIT 10";
    const values = [`%${query}%`];

    const result = await pool.query(jobQuery, values);
    if (result.rows.length === 0) {
      console.log("⚠️ No matching jobs found.");
      return res.status(404).json({message: "No matching jobs found."});
    }

    // Batch save the query & results to Firestore
    const batch = db.batch();
    const docRef = db.collection("job_queries").doc();
    batch.set(docRef, {
      query,
      results: result.rows,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();

    console.log("✅ Job search results saved to Firestore.");
    return res.status(200).json({jobs: result.rows});
  } catch (error) {
    console.error("❌ Error processing job search request:", error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

// 🛠 Function to Clean Up PostgreSQL Connections
const {onSchedule} = require("firebase-functions/v2/scheduler");

exports.cleanup = onSchedule("every 24 hours", async () => {
  try {
    console.log("🗑 Closing PostgreSQL pool connections...");
    await pool.end();
    console.log("✅ PostgreSQL connections closed.");

    // Reinitialize the pool for next requests
    pool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  } catch (error) {
    console.error("❌ Error closing PostgreSQL connections:", error);
  }
});
