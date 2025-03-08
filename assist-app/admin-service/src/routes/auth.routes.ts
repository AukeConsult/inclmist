import { Router } from "express";
import { getUser, getAllUsers } from "../controllers/auth.controller";

const router = Router();

// ✅ Fetch a specific user (by UID or Email)
router.get("/", getUser);

// ✅ Fetch all users
router.get("/all", getAllUsers);

export default router;
