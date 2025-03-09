import { Router } from "express";
import { getUsers, addUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/add", addUser);

export default router;
