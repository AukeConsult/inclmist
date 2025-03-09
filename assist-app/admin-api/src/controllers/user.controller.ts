import { Request, Response } from "express";
import { createUser, fetchUsers } from "../services/users.service";

export const addUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const userId = await createUser(name, email);
        res.status(201).json({ message: "User created", userId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (_req: Request, res: Response) => {
    try {
            const users = await fetchUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
