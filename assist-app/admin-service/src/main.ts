import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.FUNCTIONS_EMULATOR !== "true") {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

export default app;
