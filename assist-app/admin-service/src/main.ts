import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes";

console.log("🔥 Starting Express Server..."); // ✅ Log when the server starts

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`); // ✅ Log when server is ready
});
