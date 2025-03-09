import { Request, Response } from "express";
import { getUserByUID, getUserByEmail, listUsers } from "../services/auth.service";

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid, email } = req.query;
        let user;
        if (uid) {
            user = await getUserByUID(uid as string);
        } else if (email) {
            user = await getUserByEmail(email as string);
        } else {
            res.status(400).json({ error: "Provide uid or email" });
            return;
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await listUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
