import express, { Request, Response } from "express";
import {readFeed} from "./ReadNavFeed";
const app = express();
const port = process.env.PORT || 3000;

const res: number = await readFeed();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});

