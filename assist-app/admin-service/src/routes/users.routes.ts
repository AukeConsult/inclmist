import { Router } from "express";
import { getUsers, addUser } from "../controller/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/add", addUser);

export default router;
